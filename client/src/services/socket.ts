import io from "socket.io-client";
import config from "../config";

const host = window.location.host.split(":")[0];

const socket = io(`http://${host}:${config.server.port}`, {
  autoConnect: false,
});

export default {
  connect() {
    return socket.connect();
  },
  on(event: string, fn: (data?: any) => void) {
    return socket.on(event, fn);
  },
  off(event: string, fn: (data?: any) => void) {
    return socket.off(event, fn);
  },
  emit(event: string, data?: any) {
    return socket.emit(event, data);
  },
};
