import * as os from "node:os";
import * as path from "node:path";
import * as puppeteer from "puppeteer-core";
import * as express from "express";
import database from "./services/database";
import { app, server, socket } from "./services/app";
import config from "./config";
import scan from "./actions/scan";

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
  try {
    if (!EXECUTABLE_PATHS[os.platform()]) {
      throw new Error("This app is not supported on the current OS");
    }

    if (config.env === "production") {
      app.use(express.static(path.join(config.paths.client, "build")));
    }

    await database.sync();

    socket.on("connection", (socket) => {
      socket.on("scan", scan(socket));
    });

    console.log(`Server running at http://localhost:${config.server.port}`);

    const browser = await puppeteer.launch({
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

    async function cleanup() {
      socket.close();
      await Promise.all([browser.close(), server.close(), database.close()]);
      process.exit(0);
    }

    browser.on("disconnected", cleanup);
    process.on("SIGINT", cleanup);
    process.on("uncaughtException", cleanup);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
