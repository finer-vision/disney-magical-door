import { Sequelize } from "sequelize-typescript";
import config from "../config";

const database = new Sequelize({
  dialect: config.database.dialect,
  storage: config.database.storage,
  logging: false,
  models: config.database.entities,
});

export default database;
