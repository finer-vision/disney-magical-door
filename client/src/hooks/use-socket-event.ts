import React from "react";
import socket from "@/services/socket";

export default function useSocketEvent(event: string, fn: (data: any) => void) {
  React.useEffect(() => {
    socket.on(event, fn);
    return () => {
      socket.off(event, fn);
    };
  }, [event, fn]);
}
