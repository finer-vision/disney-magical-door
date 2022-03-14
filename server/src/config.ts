import * as path from "node:path";
import { Dialect } from "sequelize";
import env from "../env";
import Code from "./entities/code";
import WinTime from "./entities/win-time";
import Report from "./entities/report";

const rootPath = path.resolve(__dirname, "..", "..");

const config = {
  env: process.env.NODE_ENV,
  passphrases: env.passphrases,
  paths: {
    root: rootPath,
    data: path.join(rootPath, "data"),
    client: path.join(rootPath, "client"),
  },
  server: {
    port: 3000,
  },
  client: {
    port: 8080,
  },
  database: {
    dialect: "sqlite" as Dialect,
    storage: path.join(rootPath, "data", "database.sqlite"),
    entities: [Code, WinTime, Report],
  },
  email: {
    preview: env.email.preview,
    send: env.email.send,
    from: env.email.from,
    transport: {
      host: env.email.smtp.host,
      port: env.email.smtp.port,
      auth: {
        user: env.email.smtp.username,
        pass: env.email.smtp.password,
      },
    },
  },
  lock: {
    timeout: 60 * 1000,
  },
  light: {
    timeout: 4000,
  },
  events: [
    // @todo make sure the test event never overlaps with any of the official events
    env.testEvent,
    {
      start: new Date("2022-04-07 10:00:00 +00:00"),
      end: new Date("2022-04-07 22:00:00 +00:00"),
      maxWinners: 7,
    },
    {
      start: new Date("2022-04-09 08:00:00 +00:00"),
      end: new Date("2022-04-09 20:00:00 +00:00"),
      maxWinners: 7,
    },
    {
      start: new Date("2022-04-12 08:00:00 +00:00"),
      end: new Date("2022-04-12 20:00:00 +00:00"),
      maxWinners: 7,
    },
    {
      start: new Date("2022-04-13 08:00:00 +00:00"),
      end: new Date("2022-04-13 20:00:00 +00:00"),
      maxWinners: 7,
    },
  ],
  adminCodes: [
    {
      id: "reset-door",
      code: "reset-door-iahenpq9mhfyrr3l",
    },
    {
      id: "open-door",
      code: "open-door-iahenpq9mhfyrr3l",
    },
  ],
  // Timeout in milliseconds
  endOfDayReportTimeout: 15 * 60 * 1000,
  delayBetweenScans: 5000,
  openBrowser: env.openBrowser,
};

export default config;
