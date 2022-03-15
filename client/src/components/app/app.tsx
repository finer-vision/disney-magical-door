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
  const [state, setState] = React.useState<State>(State.default);
  const [code, setCode] = React.useState("");
  const [videoId, setVideoId] = React.useState(0);

  const audioRef = React.useRef<HTMLAudioElement>(null);

  const endedTimeout = React.useRef<NodeJS.Timeout>();

  // Update client with state from server
  React.useEffect(() => {
    async function onData(data: { winner: boolean }) {
      clearTimeout(endedTimeout.current);
      const state = data.winner ? State.winner : State.default;
      setState(state);
      const audio = audioRef.current;
      if (audio === null) return;
      audio.src = `/assets/${state}.wav`;
      audio.currentTime = 0;
      try {
        await audio.play();
      } catch (err) {
        console.error(err);
      }
    }

    socket.connect();
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

  React.useEffect(() => {
    let videoId = 0;
    if (state === State.winner) {
      videoId = Math.round(Math.random() * (config.winningVideos - 1));
    }
    setVideoId(videoId);
  }, [state]);

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
        <audio ref={audioRef} />
        <Video
          src={`/assets/videos/${dayState}/${state}/${videoId}.mp4`}
          loop={state === State.default}
          onEnded={onEnded}
        />
        <Scan onScan={setCode} />
      </AppWrapper>
    </React.Suspense>
  );
}
