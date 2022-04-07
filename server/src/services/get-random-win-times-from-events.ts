import * as crypto from "node:crypto";
import { Event } from "../types";
import { currentTime } from "../utils";

export default function getRandomWinTimesFromEvents(events: Event[]) {
  const winTimes: Date[] = [];

  events.forEach((event) => {
    const { start, end, maxWinners } = event;
    const eventDurationInMs = end.getTime() - start.getTime();
    const winningIntervalInMs = eventDurationInMs / maxWinners;
    for (
      let offset = 0;
      offset < eventDurationInMs;
      offset += winningIntervalInMs
    ) {
      const intervalRangeInMs = [
        Math.floor(start.getTime() + offset),
        Math.floor(start.getTime() + offset + winningIntervalInMs - 1000),
      ];
      const randomWinTimeInMs = crypto.randomInt(
        intervalRangeInMs[0],
        intervalRangeInMs[1]
      );
      const winTime = currentTime();
      winTime.setTime(randomWinTimeInMs);
      winTimes.push(winTime);
    }
  });

  return winTimes;
}
