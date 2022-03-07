import database, { importCodes } from "./services/database";
import { socket } from "./services/app";
import config from "./config";
import Lock from "./services/lock";
import Code from "./entities/code";

(async () => {
  try {
    await database.sync();

    await importCodes();

    const lock = new Lock();

    socket.on("connection", (socket) => {
      socket.on("code", async (code: string) => {
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
      });
    });

    console.log(`Server running at http://localhost:${config.server.port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
