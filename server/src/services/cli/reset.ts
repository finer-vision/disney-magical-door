import * as path from "node:path";
import * as fs from "node:fs";
import { execSync } from "node:child_process";
import * as crypto from "node:crypto";
import { parse } from "csv-parse";
import database from "../database";
import config from "../../config";
import Code from "../../entities/code";
import WinTime from "../../entities/win-time";

export default async function reset() {
  await database.sync({ force: true });

  decryptFiles();

  await Promise.all([importCodes(), importWinTimes()]);
}

function decryptFiles() {
  const { data } = config.paths;
  const standardCodesPath = path.join(data, "codes.csv");
  const guaranteedCodesPath = path.join(data, "guaranteed-win-codes.csv");

  execSync(
    `gpg --pinentry-mode=loopback --passphrase "${config.passphrases.codes}" -d ${standardCodesPath}.gpg > ${standardCodesPath}`
  );
  execSync(
    `gpg --pinentry-mode=loopback --passphrase "${config.passphrases.guaranteedWins}" -d ${guaranteedCodesPath}.gpg > ${guaranteedCodesPath}`
  );
}

async function importWinTimes() {
  console.info("Importing win times...");

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

  await WinTime.bulkCreate(winTimes.map((timestamp) => ({ timestamp })));

  console.info("Win times imported");
}

async function importCodes(): Promise<void> {
  console.info("Importing codes + guaranteed win codes...");

  const { data } = config.paths;
  const standardCodesPath = path.join(data, "codes.csv");
  const guaranteedCodesPath = path.join(data, "guaranteed-win-codes.csv");

  try {
    const [standardCodes, guaranteedCodes] = await Promise.all([
      getRecords<string>(standardCodesPath),
      getRecords<string>(guaranteedCodesPath),
    ]);

    const standardCodeRecords = standardCodes.map((code) => {
      return { code };
    });
    const guaranteedCodeRecords = guaranteedCodes.map((code) => {
      return { code, guaranteedWin: true };
    });

    await Promise.all([
      Code.bulkCreate(standardCodeRecords),
      Code.bulkCreate(guaranteedCodeRecords),
    ]);
  } catch (err) {
    console.error("Failed to import all codes:", err);
  }

  function getRecords<Record>(filePath: string): Promise<Record[]> {
    return new Promise((resolve, reject) => {
      const parser = parse({ delimiter: ",", fromLine: 2 }, (err, records) => {
        if (err) return reject(err);
        resolve(records);
      });
      fs.createReadStream(filePath).pipe(parser);
    });
  }

  console.info("Codes + guaranteed win codes imported");
}
