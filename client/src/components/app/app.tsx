import React from "react";
import { AppReset, AppWrapper } from "@/components/app/styles";
import useSocketEvent from "@/hooks/use-socket-event";
import useChangeEvent from "@/hooks/use-change-event";
import socket from "@/services/socket";

export default function App() {
  const [video, setVideo] = React.useState("loop");
  useSocketEvent("data", (data) => setVideo(data.video));

  const inputRef = React.useRef<HTMLInputElement>(null);

  const onChange = useChangeEvent<HTMLInputElement>((event) => {
    socket.emit("scan", event.target.value);
    event.target.value = "";
  }, []);

  React.useEffect(() => {
    const input = inputRef.current;
    if (input === null) return;
    input.focus();

    function onFocus() {
      if (input === null) return;
      input.focus();
    }

    function onBlur() {
      if (input === null) return;
      input.focus();
    }

    window.addEventListener("focus", onFocus);
    input.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("focus", onFocus);
      input.removeEventListener("blur", onBlur);
    };
  }, []);

  return (
    <React.Suspense fallback="Loading...">
      <AppReset />
      <AppWrapper>
        <video src={`/assets/${video}.mp4`} muted autoPlay playsInline loop />
        <input ref={inputRef} type="text" onChange={onChange} />
      </AppWrapper>
    </React.Suspense>
  );
}
