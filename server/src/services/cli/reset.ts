import * as path from "node:path";
import { execSync } from "node:child_process";
import database from "../database";
import config from "../../config";
import Code from "../../entities/code";
import parseCsv from "../parse-csv";
import WinTime from "../../entities/win-time";
import getRandomWinTimesFromEvents from "../get-random-win-times-from-events";

export default async function reset() {
  await database.sync({ force: true });

  decryptFiles();

  await Promise.all([importCodes(), importWinTimes()]);
}

function decryptFiles() {
  const { data } = config.paths;
  const standardCodesPath = path.join(data, "codes.csv");
  const guaranteedCodesPath = path.join(data, "guaranteed-win-codes.csv");
  const winTimesPath = path.join(data, "win-times.csv");

  execSync(
    `gpg --pinentry-mode=loopback --passphrase "${config.passphrases.codes}" -d ${standardCodesPath}.gpg > ${standardCodesPath}`
  );
  execSync(
    `gpg --pinentry-mode=loopback --passphrase "${config.passphrases.guaranteedWins}" -d ${guaranteedCodesPath}.gpg > ${guaranteedCodesPath}`
  );
  execSync(
    `gpg --pinentry-mode=loopback --passphrase "${config.passphrases.winTimes}" -d ${winTimesPath}.gpg > ${winTimesPath}`
  );
}

async function importWinTimes() {
  console.info("Importing win times...");

  const winTimes = await parseCsv<string>(
    path.join(config.paths.data, "win-times.csv")
  );

  await WinTime.bulkCreate(
    winTimes.map((timestamp) => {
      return { timestamp };
    })
  );

  const testWinTimes = getRandomWinTimesFromEvents(config.testEvents);

  await WinTime.bulkCreate(
    testWinTimes.map((timestamp) => {
      return { timestamp };
    })
  );

  console.info("Win times imported");
}

async function importCodes(): Promise<void> {
  console.info("Importing codes + guaranteed win codes...");

  const { data } = config.paths;
  const standardCodesPath = path.join(data, "codes.csv");
  const guaranteedCodesPath = path.join(data, "guaranteed-win-codes.csv");

  try {
    const [standardCodes, guaranteedCodes] = await Promise.all([
      parseCsv<string>(standardCodesPath),
      parseCsv<string>(guaranteedCodesPath),
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

  console.info("Codes + guaranteed win codes imported");
}
