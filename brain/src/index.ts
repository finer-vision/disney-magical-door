import database, { importCodes } from "./services/database";

(async () => {
  try {
    await database.sync();
    await importCodes();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
