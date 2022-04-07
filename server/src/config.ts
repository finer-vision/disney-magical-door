import * as path from "node:path";
import { Dialect } from "sequelize";
import env from "../env";
import Code from "./entities/code";
import WinTime from "./entities/win-time";
import Win from "./entities/win";
import Report from "./entities/report";
import { removeTimezoneOffset } from "./utils";

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
    to: [
      // Emails of people who should receive end of day winners CSV file
      "jamescraig@finervision.com",
    ],
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
  events: [
    {
      start: removeTimezoneOffset(new Date("2022-04-07T10:00:00")),
      end: removeTimezoneOffset(new Date("2022-04-07T22:00:00")),
      maxWinners: 7,
    },
    {
      start: removeTimezoneOffset(new Date("2022-04-09T08:00:00")),
      end: removeTimezoneOffset(new Date("2022-04-09T20:00:00")),
      maxWinners: 7,
    },
    {
      start: removeTimezoneOffset(new Date("2022-04-12T08:00:00")),
      end: removeTimezoneOffset(new Date("2022-04-12T20:00:00")),
      maxWinners: 7,
    },
    {
      start: removeTimezoneOffset(new Date("2022-04-13T08:00:00")),
      end: removeTimezoneOffset(new Date("2022-04-13T20:00:00")),
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
