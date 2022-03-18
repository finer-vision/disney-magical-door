import React from "react";
import { DebugWrapper } from "@/components/debug/styles";
import useSocketEvent from "@/hooks/use-socket-event";
import socket from "@/services/socket";

type WinTime = {
  timestamp: string; // Date string
  used: boolean;
  usedAt: string; // Date string
};

type Code = {
  id: number;
  code: string;
  used: boolean;
  guaranteedWin: boolean;
  usedAt: string; // Date string
};

export default function Debug() {
  const [winTimes, setWinTimes] = React.useState<WinTime[]>([]);
  const [lastCodeScans, setLastCodeScans] = React.useState<Code[]>([]);

  useSocketEvent("update", (data) => {
    setWinTimes(data?.winTimes ?? []);
    setLastCodeScans(data?.lastCodeScans ?? []);
  });

  React.useEffect(() => {
    socket.connect();
    socket.emit("admin");
    document.title = "Disney Magical Door (DEBUG MODE)";
    return () => {
      document.title = "Disney Magical Door";
    };
  }, []);

  return (
    <DebugWrapper>
      <h3>Debug Mode</h3>

      <h4>Win Times</h4>

      <table style={{ marginBottom: "1em" }}>
        <thead>
          <tr>
            <td>used</td>
            <td>timestamp</td>
            <td>usedAt</td>
          </tr>
        </thead>
        <tbody>
          {winTimes.map((winTime, index) => {
            return (
              <tr key={index}>
                <td>{winTime.used ? "Y" : "N"}</td>
                <td>{new Date(winTime.timestamp).toLocaleString()}</td>
                <td>
                  {winTime.usedAt === null
                    ? "Never"
                    : new Date(winTime.usedAt).toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h4>Last Scans</h4>

      <table>
        <thead>
          <tr>
            <td>used</td>
            <td>guaranteedWin</td>
            <td>code</td>
            <td>usedAt</td>
          </tr>
        </thead>
        <tbody>
          {lastCodeScans.map((lastCodeScan, index) => {
            return (
              <tr key={index}>
                <td>{lastCodeScan.used ? "Y" : "N"}</td>
                <td>{lastCodeScan.guaranteedWin ? "Y" : "N"}</td>
                <td>{lastCodeScan.code}</td>
                <td>{new Date(lastCodeScan.usedAt).toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </DebugWrapper>
  );
}
