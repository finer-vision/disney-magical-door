import * as path from "node:path";
import { Dialect } from "sequelize";
import Code from "../entities/code";
import WinTime from "../entities/win-time";

const rootPath = path.resolve(__dirname, "..", "..", "..");

const config = {
  paths: {
    root: rootPath,
    data: path.join(rootPath, "data"),
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
    // Test
    {
      start: new Date("2022-03-07 09:00:00 +00:00"),
      end: new Date("2022-03-07 19:00:00 +00:00"),
      maxWinners: 10,
    },
  ],
};

export default config;
