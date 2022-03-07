import * as express from "express";
import * as cors from "cors";
import { Server } from "socket.io";
import config from "../config/config";

const app = express();

app.use(
  cors({
    origin: `http://localhost:${config.client.port}`,
  })
);

const server = app.listen(config.server.port);

const socket = new Server({
  cors: {
    origin: `http://localhost:${config.client.port}`,
  },
});

socket.listen(server);

export { app, server, socket };
