import * as path from "node:path";
import { Dialect } from "sequelize";
import env from "../env";
import Code from "./entities/code";
import WinTime from "./entities/win-time";

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
    entities: [Code, WinTime],
  },
  lock: {
    timeout: 5000,
  },
  events: [
    // @todo make sure the test event never overlaps with any of the official events
    env.testEvent,
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
};

export default config;
