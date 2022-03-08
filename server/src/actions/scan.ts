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

export default function scan(socket: Socket) {
  return async (scan: Scan) => {
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
            hardware.unlock(config.lock.timeout);
            hardware.blueLight();
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
        hardware.lock();
        hardware.redLight();
        return;
      }

      // Valid code used
      const winner = await isWin(matchingCode);
      await matchingCode.update({ used: true, winner, usedAt: new Date() });
      socket.emit("data", { winner });

      if (winner) {
        hardware.unlock(config.lock.timeout);
        hardware.greenLight();
      }
    } catch (err) {
      console.error(err);
    }
  };
}
