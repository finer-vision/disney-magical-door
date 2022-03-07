import WinTime from "../entities/win-time";
import generateWinTimes from "./cli/generate-win-times";

export default async function importWinTimes() {
  if ((await WinTime.count()) > 0) {
    console.log("Win times imported, skipping import");
  } else {
    console.log("Importing win times...");
    try {
      await WinTime.bulkCreate(
        generateWinTimes().map((winTime) => {
          return { timestamp: winTime };
        })
      );
      console.log("Win times imported");
    } catch (err) {
      console.error(err);
    }
  }
}
