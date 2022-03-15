import * as path from "node:path";
import * as fs from "node:fs/promises";
import { execSync } from "node:child_process";
import { format } from "date-fns";
import { stringify } from "csv-stringify";
import config from "../../config";
import getRandomWinTimesFromEvents from "../get-random-win-times-from-events";

export default async function generateEncryptedWinTimesCsv() {
  const winTimes = getRandomWinTimesFromEvents(config.events);

  const timestamps = winTimes.map((winTime) => {
    return [format(winTime, "y-MM-dd HH:mm:ss +01:00")];
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
