import * as path from "node:path";
import { Dialect } from "sequelize";
import Code from "../entities/code";
import WinTime from "../entities/win-time";
import winTimes from "./win-times";

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
  winTimes,
};

export default config;
