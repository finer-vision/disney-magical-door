import * as path from "node:path";
import { Dialect } from "sequelize";
import Code from "./entities/code";
import WinTime from "./entities/win-time";

const rootPath = path.resolve(__dirname, "..", "..");

export default {
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
    storage: path.resolve(__dirname, "..", "..", "data", "database.sqlite"),
    entities: [Code, WinTime],
  },
  lock: {
    timeout: 5000,
  },
  winTimes: [
    // 1st day
    new Date("2022-03-07 11:00:00 +00:00"),
  ],
};
