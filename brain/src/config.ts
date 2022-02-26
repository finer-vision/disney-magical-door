import * as path from "node:path";
import { Dialect } from "sequelize";
import Code from "./entities/code";

const rootPath = path.resolve(__dirname, "..", "..");

export default {
  paths: {
    root: rootPath,
    data: path.join(rootPath, "data"),
  },
  database: {
    dialect: "sqlite" as Dialect,
    storage: path.resolve(__dirname, "..", "..", "data", "database.sqlite"),
    entities: [Code],
  },
};
