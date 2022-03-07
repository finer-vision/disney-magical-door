import React from "react";
import socket from "@/services/socket";

export default function useSocketEvent<Data>(
  event: string,
  fn: (data: Data) => void
) {
  React.useEffect(() => {
    socket.on(event, fn);
    return () => {
      socket.off(event, fn);
    };
  }, [event, fn]);
}
