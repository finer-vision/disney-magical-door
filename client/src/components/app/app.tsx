import React from "react";
import { AppReset, AppWrapper } from "@/components/app/styles";
import useSocketEvent from "@/hooks/use-socket-event";
import useChangeEvent from "@/hooks/use-change-event";
import socket from "@/services/socket";

export default function App() {
  const [video, setVideo] = React.useState("loop");
  useSocketEvent<{ winner: boolean }>("data", (data) => {
    setVideo(data.winner ? "win" : "loop");
  });

  const inputRef = React.useRef<HTMLInputElement>(null);

  const [value, setValue] = React.useState("");

  // @note the QR scanner inputs one character at a time,
  // this effect collects all characters then fires the code
  // off to the server when finished
  React.useEffect(() => {
    const input = inputRef.current;
    if (input === null) return;
    const timeout = setTimeout(() => {
      socket.emit("scan", { code: value });
      input.value = "";
    }, 250);
    return () => clearTimeout(timeout);
  }, [value]);

  const onChange = useChangeEvent<HTMLInputElement>((event) => {
    setValue(event.target.value);
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
