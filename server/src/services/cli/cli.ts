import reset from "./reset";
import generateRandomQrCodes from "./generate-random-qr-codes";
import generateEncryptedWinTimesCsv from "./generate-encrypted-win-times-csv";

(async () => {
  try {
    const [, , command] = process.argv;
    switch (command) {
      case "reset":
        await reset();
        break;
      case "generateRandomQrCodes":
        await generateRandomQrCodes();
        break;
      case "generateEncryptedWinTimesCsv":
        await generateEncryptedWinTimesCsv();
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
