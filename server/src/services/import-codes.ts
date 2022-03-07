import * as path from "node:path";
import * as fs from "node:fs/promises";
import config from "../config/config";
import Code from "../entities/code";

export default async function importCodes() {
  const codesFile = path.join(config.paths.data, "codes.csv");
  const guaranteedWinCodesFile = path.join(
    config.paths.data,
    "guaranteed-win-codes.csv"
  );
  if ((await Code.count()) > 0) {
    console.log("Codes imported, skipping import");
  } else {
    console.log("Importing codes...");
    try {
      await fs.access(codesFile);
      await fs.access(guaranteedWinCodesFile);
      const codesData = await fs.readFile(codesFile);
      const guaranteedWinCodesData = await fs.readFile(guaranteedWinCodesFile);
      const [, ...codesRows] = codesData
        .toString()
        .split("\n")
        .map((row) => row.trim())
        .map((row) => {
          const cols = row.split(",");
          return cols.map((col) => col.trim());
        });
      const [, ...guaranteedWinCodesRows] = guaranteedWinCodesData
        .toString()
        .split("\n")
        .map((row) => row.trim())
        .map((row) => {
          const cols = row.split(",");
          return cols.map((col) => col.trim());
        });
      let codes: Code["_attributes"][] = codesRows.map((cols) => {
        return {
          code: cols[0],
          used: false,
          guaranteedWin: false,
          usedAt: null,
        };
      });
      codes = codes.concat(
        guaranteedWinCodesRows.map((cols) => {
          return {
            code: cols[0],
            used: false,
            guaranteedWin: true,
            usedAt: null,
          };
        })
      );
      await Code.bulkCreate(codes);
      console.log("Codes imported");
    } catch {
      console.error(
        "Failed to import codes because codes.csv or guaranteed-win-codes.csv don't exist in data directory"
      );
    }
  }
}
