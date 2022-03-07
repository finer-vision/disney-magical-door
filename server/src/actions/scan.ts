import { Socket } from "socket.io";
import Code from "../entities/code";
import Lock from "../services/lock";

const lock = new Lock();

export default function scan(socket: Socket) {
  return async (code: string) => {
    const matchingCode = await Code.findOne({
      where: { code, used: false },
    });

    // Lose
    if (!matchingCode) {
      socket.emit("data", { video: "loop" });
      lock.lock();
      return;
    }

    // Win
    await matchingCode.update({ used: true, usedAt: new Date() });
    socket.emit("data", { video: "win" });
    lock.unlock(5000);
  };
}
