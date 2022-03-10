import * as os from "node:os";
import * as path from "node:path";
import * as puppeteer from "puppeteer-core";
import { Browser } from "puppeteer-core";
import * as express from "express";
import database from "./services/database";
import scheduler from "./services/scheduler/scheduler";
import { app, server, socket } from "./services/app";
import config from "./config";
import scan from "./actions/scan";
import adminData from "./services/admin-data";

const EXECUTABLE_PATHS: { [key: string]: string } = {
  darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  linux: "/usr/bin/google-chrome",
};

const ASPECT = 1080 / 1920;
const HEIGHT = 900;

const PORT = config[config.env === "development" ? "client" : "server"].port;

const args = [
  "--remote-debugging-port=9222",
  "--no-first-run",
  "--disable-pinch",
  "--no-default-check",
  "--overscroll-history-navigation=0",
  `--app=http://localhost:${PORT}`,
];

if (config.env === "production") {
  args.push("--kiosk");
}

if (config.env === "development") {
  args.push(`--window-size=${Math.floor(HEIGHT * ASPECT)},${HEIGHT}`);
}

(async () => {
  let browser: Browser = null;
  try {
    if (!EXECUTABLE_PATHS[os.platform()]) {
      throw new Error("This app is not supported on the current OS");
    }

    if (config.env === "production") {
      app.use(express.static(path.join(config.paths.client, "build")));
    }

    scheduler();

    await database.sync();

    socket.on("connection", (socket) => {
      socket.on("admin", async () => {
        try {
          socket.emit("update", await adminData());
        } catch (err) {
          console.error(err);
        }
      });
      socket.on("scan", scan(socket));
    });

    console.log(`Server running at http://localhost:${config.server.port}`);

    if (config.openBrowser) {
      browser = await puppeteer.launch({
        headless: false,
        args,
        executablePath: EXECUTABLE_PATHS[os.platform()],
        ignoreDefaultArgs: [
          "--enable-automation",
          "--enable-blink-features=IdleDetection",
        ],
      });

      const context = browser.defaultBrowserContext();
      await context.clearPermissionOverrides();
    }

    async function cleanup() {
      socket.close();
      if (browser !== null) {
        await browser.close();
      }
      await Promise.all([server.close(), database.close()]);
      process.exit(0);
    }

    if (browser !== null) {
      browser.on("disconnected", cleanup);
    }
    process.on("SIGINT", cleanup);
    process.on("uncaughtException", cleanup);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
