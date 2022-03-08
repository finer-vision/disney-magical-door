import React from "react";
import { AppReset, AppWrapper } from "@/components/app/styles";
import Scan from "@/components/scan/scan";
import Video from "@/components/video/video";
import socket from "@/services/socket";

enum State {
  default = "default",
  winner = "winner",
}

export default function App() {
  const [state, setState] = React.useState<State>(State.default);
  const [code, setCode] = React.useState("");

  // Update client with state from server
  React.useEffect(() => {
    function onData(data: { winner: boolean }) {
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

  return (
    <React.Suspense fallback="Loading...">
      <AppReset />
      <AppWrapper>
        <Video src={`/assets/${state}.mp4`} />
        <Scan onScan={setCode} />
      </AppWrapper>
    </React.Suspense>
  );
}
