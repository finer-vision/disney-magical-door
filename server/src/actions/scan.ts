import { Socket } from "socket.io";
import { Op } from "sequelize";
import Code from "../entities/code";
import WinTime from "../entities/win-time";
import Win from "../entities/win";
import Hardware from "../services/hardware";
import config from "../config";
import { currentTime } from "../utils";
import state from "../state";

const blacklistedCodes = [
  "172e64d8be537ca0",
  "025aeda1a926da08",
  "7935d99e65268d97",
  "df0e81c338e58f88",
  "979fbaf2e3c90b4d",
  "dc2bfff781c952c1",
  "e9074975a92b8bae",
  "fbd548233591e329",
  "ba4daf525d3dd885",
  "731c27381420191b",
  "9fc4868e97b96be2",
  "44b8a31b6747fc0d",
  "f8b9e65f8677f09e",
  "4586f83c737fd33f",
  "7b30d6e0178fda0a",
  "cc437d4a94a1e2d4",
  "7a75890237222257",
  "54cc884365acaa7b",
  "8929b5954364e726",
];

async function isWin(code: Code): Promise<boolean> {
  if (code.guaranteedWin) return true;
  const now = currentTime();
  if (config.env === "development") {
    const winTimeIndex = config.testWinTimes.findIndex((testWinTime) => {
      return testWinTime.timestamp.getTime() <= now && !testWinTime.used;
    });
    if (winTimeIndex === -1) return false;
    config.testWinTimes[winTimeIndex].used = true;
    config.testWinTimes[winTimeIndex].usedAt = now;
    return true;
  }
  const winTime = await WinTime.findOne({
    where: {
      timestamp: {
        [Op.lte]: now,
      },
      used: false,
    },
  });
  if (!winTime) return false;
  await winTime.update({ used: true, usedAt: now });
  return true;
}

const hardware = new Hardware();

type Scan = {
  code: string;
};

let lastScanTimestamp = 0;

export default function scan(socket: Socket) {
  return async (scan: Scan) => {
    try {
      const now = currentTime().getTime();

      // Prevent scan from firing multiple times
      if (now < lastScanTimestamp + config.delayBetweenScans) return;
      lastScanTimestamp = now;

      const adminCode = config.adminCodes.find((adminCode) => {
        return adminCode.code === scan.code;
      });

      if (adminCode) {
        switch (adminCode.id) {
          case "reset-door":
            hardware.lock();
            hardware.blueLight();
            socket.emit("data", { winner: false, admin: true });
            state.winVideoPlaying = false;
            break;
          case "open-door":
            hardware.unlock();
            hardware.blueLight();
            break;
        }
        return;
      }

      if (state.winVideoPlaying) {
        console.warn(
          `[${new Date().toLocaleTimeString()}] Win video is currently playing, ignoring scan`
        );
        return;
      }

      if (blacklistedCodes.includes(scan.code)) {
        socket.emit("data", { winner: false });
        hardware.lock();
        hardware.redLight();
        return;
      }

      const matchingCode = await Code.findOne({
        where: {
          code: scan.code,
          // Make sure the code isn't reused. However, if it's a guaranteedWin
          // then it can be used multiple times
          [Op.or]: [
            {
              used: false,
            },
            {
              guaranteedWin: true,
            },
          ],
        },
      });

      // Invalid code used
      if (!matchingCode) {
        socket.emit("data", { winner: false });
        console.log("info: hardware.lock");
        hardware.lock();
        hardware.redLight();
        return;
      }

      // Valid code used
      const winner = await isWin(matchingCode);
      await matchingCode.update({ used: true, usedAt: now });
      socket.emit("data", { winner });
      if (!winner) {
        hardware.redLight();
      }

      if (winner) {
        state.winVideoPlaying = true;
        setTimeout(() => {
          if (state.winVideoPlaying) {
            state.winVideoPlaying = false;
          }
        }, config.winVideoDuration);
        console.log("info: hardware.unlock");
        hardware.unlock();
        hardware.greenLight();
        await Win.create({
          code: scan.code,
          guaranteedWin: matchingCode.guaranteedWin,
          usedAt: now,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
}
