import React from "react";
import useChangeEvent from "@/hooks/use-change-event";
import { ScanWrapper } from "@/components/scan/styles";
import { useAppState } from "@/state/app-state";

type Props = {
  onScan: (code: string) => void;
  inputTimeout?: number;
};

export default function Scan({ onScan, inputTimeout = 50 }: Props) {
  const { setInteracted } = useAppState();

  const onScanRef = React.useRef(onScan);
  React.useMemo(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const [code, setCode] = React.useState("");

  // @note the QR scanner inputs one character at a time,
  // this effect collects all characters then fires the code
  // off to the server when finished
  React.useEffect(() => {
    const input = inputRef.current;
    if (input === null) return;
    const timeout = setTimeout(() => {
      onScanRef.current(code);
      input.value = "";
    }, inputTimeout);
    return () => clearTimeout(timeout);
  }, [code, inputTimeout]);

  const onChange = useChangeEvent<HTMLInputElement>((event) => {
    setInteracted(true);
    setCode(event.target.value);
  }, []);

  // Always keep input focused so QR code gets inserted into it
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

  const onSubmit = React.useCallback((event: React.FormEvent) => {
    event.preventDefault();
    console.log("onSubmit");
  }, []);

  return (
    <ScanWrapper onSubmit={onSubmit}>
      <input ref={inputRef} type="text" onChange={onChange} />
    </ScanWrapper>
  );
}
