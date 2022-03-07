import { Socket } from "socket.io";
import { Op } from "sequelize";
import Code from "../entities/code";
import Lock from "../services/lock";
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

const lock = new Lock();

export default function scan(socket: Socket) {
  return async (code: string) => {
    try {
      const matchingCode = await Code.findOne({
        where: { code, used: false },
      });

      // Invalid code used
      if (!matchingCode) {
        socket.emit("data", { video: "loop" });
        lock.lock();
        return;
      }

      // Valid code used
      const winner = await isWin(matchingCode);
      await matchingCode.update({ used: true, winner, usedAt: new Date() });
      if (winner) {
        socket.emit("data", { video: "win" });
        lock.unlock(config.lock.timeout);
      }
    } catch (err) {
      console.error(err);
    }
  };
}
