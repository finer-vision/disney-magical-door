import database, { importCodes } from "./services/database";
import { server, socket } from "./services/app";
import config from "./config";

(async () => {
  try {
    await database.sync();

    await importCodes();

    socket.listen(server);

    socket.on("connection", () => {
      console.log("connection");
    });

    console.log(`Server running at http://localhost:${config.server.port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
