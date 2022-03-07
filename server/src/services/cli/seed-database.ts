import database from "../database";
import importCodes from "../import-codes";

export default async function seedDatabase() {
  await database.sync({ force: true });
  await importCodes();
}
