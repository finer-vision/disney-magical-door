import database from "./services/database";
import { socket } from "./services/app";
import config from "./config/config";
import scan from "./actions/scan";

(async () => {
  try {
    await database.sync();

    socket.on("connection", (socket) => {
      socket.on("scan", scan(socket));
    });

    console.log(`Server running at http://localhost:${config.server.port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
