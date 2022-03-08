import * as path from "node:path";
import * as fs from "node:fs/promises";
import { execSync } from "node:child_process";
import * as crypto from "node:crypto";
import { format } from "date-fns";
import { stringify } from "csv-stringify";
import config from "../../config";

export default async function generateEncryptedWinTimesCsv() {
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

  const timestamps = winTimes.map((winTime) => {
    return [format(winTime, "y-MM-dd HH:mm:ss +00:00")];
  });

  const winTimePath = path.join(config.paths.data, "win-times.csv");

  await fs.writeFile(
    winTimePath,
    stringify([["timestamp"], ...timestamps]),
    "utf-8"
  );

  execSync(
    `gpg -c --batch --passphrase ${config.passphrases.winTimes} --yes ${winTimePath}`
  );
}
