import { Sequelize } from "sequelize-typescript";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import config from "../config";
import Code from "../entities/code";

const database = new Sequelize({
  dialect: config.database.dialect,
  storage: config.database.storage,
  logging: false,
  models: config.database.entities,
});

export async function importCodes() {
  const codesFile = path.join(config.paths.data, "codes.csv");
  const count = await Code.count();
  if (count > 0) {
    console.log("Codes imported, skipping import");
    return;
  }

  console.log("Importing codes...");
  try {
    await fs.access(codesFile);
    const data = await fs.readFile(codesFile);
    const [, ...rows] = data
      .toString()
      .split("\n")
      .map((row) => row.trim())
      .map((row) => {
        const cols = row.split(",");
        return cols.map((col) => col.trim());
      });
    const codes: Code["_attributes"][] = rows.map((cols) => {
      return {
        code: cols[0],
        used: false,
        usedAt: null,
      };
    });
    await Code.bulkCreate(codes);
    console.log("Codes imported");
  } catch {
    console.error(
      `Failed to import codes because codes.csv doesn't exist: "${codesFile}"`
    );
  }
}

export default database;
