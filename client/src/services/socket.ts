import io from "socket.io-client";
import config from "../config";

const socket = io(`http://localhost:${config.server.port}`);

export default socket;
