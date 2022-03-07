import database from "../database";
import importCodes from "../import-codes";
import importWinTimes from "../import-win-times";

export default async function seedDatabase() {
  await database.sync({ force: true });
  await importCodes();
  await importWinTimes();
}
