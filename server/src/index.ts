import * as os from "os";
import * as puppeteer from "puppeteer-core";
import database from "./services/database";
import { socket } from "./services/app";
import config from "./config/config";
import scan from "./actions/scan";

const executablePaths: { [key: string]: string } = {
  darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  linux: "/usr/bin/google-chrome",
};

const aspect = 1080 / 1920;
const height = 900;
const width = Math.floor(height * aspect);

const args = [
  "--remote-debugging-port=9222",
  "--no-first-run",
  "--disable-pinch",
  "--no-default-check",
  "--overscroll-history-navigation=0",
  `--app=http://localhost:${config.client.port}`,
];

if (config.env === "production") {
  args.push("--kiosk");
}

if (config.env === "development") {
  args.push(`--window-size=${width},${height}`);
}

(async () => {
  try {
    if (!executablePaths[os.platform()]) {
      throw new Error("This app is not supported on the current OS");
    }

    await database.sync();

    socket.on("connection", (socket) => {
      socket.on("scan", scan(socket));
    });

    console.log(`Server running at http://localhost:${config.server.port}`);

    const browser = await puppeteer.launch({
      headless: false,
      args,
      executablePath: executablePaths[os.platform()],
      ignoreDefaultArgs: [
        "--enable-automation",
        "--enable-blink-features=IdleDetection",
      ],
    });

    const context = browser.defaultBrowserContext();
    await context.clearPermissionOverrides();

    browser.on("disconnected", async () => {
      await browser.close();
      process.exit(0);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
