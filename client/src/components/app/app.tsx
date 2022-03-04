import React from "react";
import { AppReset, AppWrapper } from "@/components/app/styles";
import socket from "@/services/socket";

export default function App() {
  const [video, setVideo] = React.useState("loop");

  React.useEffect(() => {
    function onData(data: any) {
      setVideo(data.video);
    }

    socket.on("data", onData);
    return () => {
      socket.off("data", onData);
    };
  }, []);

  return (
    <React.Suspense fallback="Loading...">
      <AppReset />
      <AppWrapper>
        <video src={`/assets/${video}.mp4`} muted autoPlay playsInline loop />
      </AppWrapper>
    </React.Suspense>
  );
}
