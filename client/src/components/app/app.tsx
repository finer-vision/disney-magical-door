import React from "react";
import { AppReset, AppWrapper } from "@/components/app/styles";
import Scan from "@/components/scan/scan";
import Video from "@/components/video/video";
import socket from "@/services/socket";
import config from "@/config";

enum State {
  default = "default",
  winner = "winner",
}

export default function App() {
  const [state, setState] = React.useState<State>(State.default);
  const [code, setCode] = React.useState("");

  const endedTimeout = React.useRef<NodeJS.Timeout>();

  // Update client with state from server
  React.useEffect(() => {
    function onData(data: { winner: boolean }) {
      clearTimeout(endedTimeout.current);
      setState(data.winner ? State.winner : State.default);
    }

    socket.on("data", onData);
    return () => {
      socket.off("data", onData);
    };
  }, []);

  // Send scanned code to server and reset client code
  React.useEffect(() => {
    if (code === "") return;
    socket.emit("scan", { code });
    setCode("");
  }, [code]);

  // Go back to State.default winner video ended and
  // after timeout expires
  const onEnded = React.useCallback(() => {
    clearTimeout(endedTimeout.current);
    if (state === State.winner) {
      endedTimeout.current = setTimeout(() => {
        setState(State.default);
      }, config.winnerVideoHoldTimeout);
    }
  }, [state]);

  React.useEffect(() => {
    return () => {
      clearTimeout(endedTimeout.current);
    };
  }, []);

  return (
    <React.Suspense fallback="Loading...">
      <AppReset />
      <AppWrapper>
        <Video
          src={`/assets/${state}.mp4`}
          loop={state === State.default}
          onEnded={onEnded}
        />
        <Scan onScan={setCode} />
      </AppWrapper>
    </React.Suspense>
  );
}
