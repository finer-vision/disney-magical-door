import { Socket } from "socket.io";
import { Op } from "sequelize";
import Code from "../entities/code";
import Hardware from "../services/hardware";
import config from "../config";
import WinTime from "../entities/win-time";

async function isWin(code: Code): Promise<boolean> {
  if (code.guaranteedWin) return true;
  const now = new Date();
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
    const now = Date.now();

    // Prevent scan from firing multiple times
    if (now < lastScanTimestamp + config.delayBetweenScans) return;
    lastScanTimestamp = now;

    try {
      const adminCode = config.adminCodes.find((adminCode) => {
        return adminCode.code === scan.code;
      });

      if (adminCode) {
        switch (adminCode.id) {
          case "reset-door":
            hardware.lock();
            hardware.blueLight();
            socket.emit("data", { winner: false });
            break;
          case "open-door":
            hardware.unlock();
            hardware.blueLight();
            break;
        }
        return;
      }

      const matchingCode = await Code.findOne({
        where: {
          code: scan.code,
          // Make sure the code isn't used. However, if it's a guaranteedWin
          // then it can be used multiple times
          [Op.or]: [
            {
              used: false,
            },
            {
              guaranteedWin: false,
            },
          ],
        },
      });

      // Invalid code used
      if (!matchingCode) {
        socket.emit("data", { winner: false });
        hardware.lock();
        hardware.redLight();
        return;
      }

      // Valid code used
      const winner = await isWin(matchingCode);
      await matchingCode.update({ used: true, winner, usedAt: new Date() });
      socket.emit("data", { winner });

      if (winner) {
        hardware.unlock();
        hardware.greenLight();
      }
    } catch (err) {
      console.error(err);
    }
  };
}
