import { Socket } from "socket.io";
import { Op } from "sequelize";
import Code from "../entities/code";
import Lock from "../services/lock";
import config from "../config/config";
import WinTime from "../entities/win-time";
import adminCodes from "../config/admin-codes";

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

const lock = new Lock();

type Scan = {
  code: string;
};

export default function scan(socket: Socket) {
  return async (scan: Scan) => {
    try {
      const adminCode = adminCodes.find((adminCode) => {
        return adminCode.code === scan.code;
      });

      if (adminCode) {
        switch (adminCode.id) {
          case "reset-door":
            lock.lock();
            socket.emit("data", { winner: false });
            break;
          case "open-door":
            lock.unlock(config.lock.timeout);
            break;
        }
        return;
      }

      const matchingCode = await Code.findOne({
        where: {
          code: scan.code,
          used: false,
        },
      });

      // Invalid code used
      if (!matchingCode) {
        socket.emit("data", { winner: false });
        lock.lock();
        return;
      }

      // Valid code used
      const winner = await isWin(matchingCode);
      await matchingCode.update({ used: true, winner, usedAt: new Date() });
      socket.emit("data", { winner });

      if (winner) {
        lock.unlock(config.lock.timeout);
      }
    } catch (err) {
      console.error(err);
    }
  };
}
