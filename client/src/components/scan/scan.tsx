import React from "react";
import useChangeEvent from "@/hooks/use-change-event";
import { ScanWrapper } from "@/components/scan/styles";
import { useAppState } from "@/state/app-state";

type Props = {
  onScan: (code: string) => void;
  inputTimeout?: number;
};

export default function Scan({ onScan, inputTimeout = 50 }: Props) {
  const onScanRef = React.useRef(onScan);
  React.useMemo(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const timeoutRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // @note the QR scanner inputs one character at a time,
  // this effect collects all characters then fires the code
  // off to the server when finished
  const onChange = useChangeEvent<HTMLInputElement>(
    (event) => {
      useAppState.getState().setInteracted(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onScanRef.current(event.target.value);
        event.target.value = "";
      }, inputTimeout);
    },
    [inputTimeout]
  );

  // Always keep input focused so QR code gets inserted into it
  React.useEffect(() => {
    const input = inputRef.current;

    function focus() {
      if (input === null) return;
      input.focus();
    }

    focus();

    window.addEventListener("focus", focus);
    input.addEventListener("blur", focus);
    return () => {
      window.removeEventListener("focus", focus);
      input.removeEventListener("blur", focus);
    };
  }, []);

  return (
    <ScanWrapper>
      <input ref={inputRef} type="text" onChange={onChange} />
    </ScanWrapper>
  );
}
