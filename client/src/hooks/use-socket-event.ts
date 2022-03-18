import React from "react";
import socket from "@/services/socket";

type Fn = (data?: any) => void;

export default function useSocketEvent(event: string, fn: Fn) {
  const fnRef = React.useRef<Fn>(fn);

  React.useEffect(() => {
    socket.connect();
    socket.on(event, fnRef.current);
    return () => {
      socket.off(event, fnRef.current);
    };
  }, [event]);
}
