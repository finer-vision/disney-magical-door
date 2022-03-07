import * as crypto from "node:crypto";
import config from "../../config/config";

export default function generateWinTimes(): Date[] {
  const winTimes: Date[] = [];
  config.events.forEach((event) => {
    const { start, end, maxWinners } = event;
    const eventDurationInMs = end.getTime() - start.getTime();
    const winningIntervalInMs = eventDurationInMs / maxWinners;
    for (
      let offset = 0;
      offset < eventDurationInMs;
      offset += winningIntervalInMs
    ) {
      const intervalRangeInMs = [
        start.getTime() + offset,
        start.getTime() + offset + winningIntervalInMs - 1000,
      ];
      const randomWinTimeInSecs = crypto.randomInt(
        intervalRangeInMs[0] / 1000,
        intervalRangeInMs[1] / 1000
      );
      const winTime = new Date();
      winTime.setTime(randomWinTimeInSecs * 1000);
      winTimes.push(winTime);
    }
  });

  return winTimes;
}
