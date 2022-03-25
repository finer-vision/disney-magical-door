import getRandomWinTimesFromEvents from "../get-random-win-times-from-events";
import config from "../../config";
import WinTime from "../../entities/win-time";

export default async function generateRandomWinTimesForTestEvents() {
  const testEvent = config.events.find((event) => event.isTest === true);
  if (!testEvent) {
    console.warn("No test events in config");
    return;
  }
  const winTimes = getRandomWinTimesFromEvents([testEvent]);
  await WinTime.bulkCreate(
    winTimes.map((timestamp) => {
      return { timestamp };
    })
  );
}
