import seedDatabase from "./seed-database";
import generateWinTimes from "./generate-win-times";

(async () => {
  try {
    const [, , command] = process.argv;
    switch (command) {
      case "seedDatabase":
        await seedDatabase();
        break;
      case "generateWinTimes":
        await generateWinTimes();
        break;
      default:
        console.error(`No command found "${command}"`);
        process.exit(1);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
