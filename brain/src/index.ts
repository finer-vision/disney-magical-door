import database, { importCodes } from "./services/database";
import { socket } from "./services/app";
import config from "./config";
import Lock from "./services/lock";
import QrScanner from "./services/qr-scanner";

(async () => {
  try {
    await database.sync();

    await importCodes();

    const lock = new Lock();
    const qrScanner = new QrScanner();

    socket.on("connection", (socket) => {
      qrScanner.onScan((code) => {
        if (code === "X000SFH6PH") {
          socket.emit("data", { video: "win" });
          lock.unlock(5000);
        } else {
          socket.emit("data", { video: "loop" });
          lock.lock();
        }
      });
    });

    console.log(`Server running at http://localhost:${config.server.port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
