import React from "react";
import { AppReset, AppWrapper } from "@/components/app/styles";
import Scan from "@/components/scan/scan";
import Video from "@/components/video/video";
import Debug from "@/components/debug/debug";
import socket from "@/services/socket";
import config from "@/config";

enum State {
  default = "default",
  winner = "winner",
}

enum DayState {
  day = "day",
  night = "night",
}

function getDayState(): DayState {
  const now = new Date();
  const startOfDayEpoch = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  ).getTime();
  const elapsedTime = now.getTime() - startOfDayEpoch;
  if (elapsedTime >= config.nightStartTime) return DayState.night;
  return DayState.day;
}

export default function App() {
  const [dayState, setDayState] = React.useState<DayState>(getDayState);
  const [code, setCode] = React.useState("");

  const audioRef = React.useRef<HTMLAudioElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Update client with state from server
  React.useEffect(() => {
    const audio = audioRef.current;
    const video = videoRef.current;
    if (video === null) return;
    video.src = `/assets/videos/${dayState}/${State.default}.mp4`;
    video.currentTime = 0;
    video.loop = true;
    video.play().catch((err) => {
      console.error(err);
    });

    async function onData(data: { winner: boolean }) {
      if (audio === null || video === null) return;
      const state = data.winner ? State.winner : State.default;
      audio.src = `/assets/sounds/${state}.wav`;
      audio.currentTime = 0;
      video.src = `/assets/videos/${dayState}/${state}.mp4`;
      video.currentTime = 0;
      video.loop = state === State.default;
      try {
        await audio.play();
      } catch (err) {
        console.error(err);
      }
      try {
        await video.play();
      } catch (err) {
        console.error(err);
      }
    }

    socket.connect();
    socket.on("data", onData);
    return () => {
      socket.off("data", onData);
    };
  }, [dayState]);

  // Send scanned code to server and reset client code
  React.useEffect(() => {
    if (code === "") return;
    socket.emit("scan", { code });
    setCode("");
  }, [code]);

  const onEnded = React.useCallback(() => {
    socket.emit("videoended");
    setState((state) => {
      if (state === State.winner) return State.default;
      return state;
    });
  }, []);

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    (function updateDayState() {
      clearTimeout(timeout);
      timeout = setTimeout(updateDayState, 1000);
      setDayState(getDayState());
    })();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <React.Suspense fallback="Loading...">
      <AppReset />
      <AppWrapper>
        {config.env === "development" && <Debug />}
        <audio ref={audioRef} />
        <Video ref={videoRef} onEnded={onEnded} />
        <Scan onScan={setCode} />
      </AppWrapper>
    </React.Suspense>
  );
}
