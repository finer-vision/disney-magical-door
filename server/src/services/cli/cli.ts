import reset from "./reset";

(async () => {
  try {
    const [, , command] = process.argv;
    switch (command) {
      case "reset":
        await reset();
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
