import * as path from "node:path";
import { Dialect } from "sequelize";
import env from "../env";
import Code from "./entities/code";
import WinTime from "./entities/win-time";
import Win from "./entities/win";
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
    entities: [Code, WinTime, Win, Report],
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
    timeout: 15 * 1000,
  },
  light: {
    timeout: 4000,
  },
  testEvents: [
    {
      start: new Date("2022-03-21 10:00:00 +00:00"),
      end: new Date("2022-03-21 17:00:00 +00:00"),
      maxWinners: 7,
    },
    {
      start: new Date("2022-03-22 10:00:00 +00:00"),
      end: new Date("2022-03-22 17:00:00 +00:00"),
      maxWinners: 7,
    },
    {
      start: new Date("2022-03-23 10:00:00 +00:00"),
      end: new Date("2022-03-23 17:00:00 +00:00"),
      maxWinners: 7,
    },
    {
      start: new Date("2022-03-24 10:00:00 +00:00"),
      end: new Date("2022-03-24 17:00:00 +00:00"),
      maxWinners: 7,
    },
  ],
  events: [
    {
      start: new Date("2022-04-07 10:00:00 +01:00"),
      end: new Date("2022-04-07 22:00:00 +01:00"),
      maxWinners: 7,
    },
    {
      start: new Date("2022-04-09 08:00:00 +01:00"),
      end: new Date("2022-04-09 20:00:00 +01:00"),
      maxWinners: 7,
    },
    {
      start: new Date("2022-04-12 08:00:00 +01:00"),
      end: new Date("2022-04-12 20:00:00 +01:00"),
      maxWinners: 7,
    },
    {
      start: new Date("2022-04-13 08:00:00 +01:00"),
      end: new Date("2022-04-13 20:00:00 +01:00"),
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
