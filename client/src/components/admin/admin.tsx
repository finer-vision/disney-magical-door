import React from "react";
import {
  AdminGrid,
  AdminLastScan,
  AdminReset,
  AdminWinTimes,
  AdminWrapper,
} from "@/components/admin/styles";
import socket from "@/services/socket";

function formatTimestamp(timestamp?: string): string {
  if (!timestamp) return null;
  return new Date(timestamp).toLocaleString();
}

export default function Admin() {
  const [winTimes, setWinTimes] = React.useState<any[]>([]);
  const [lastCodeScans, setLastCodeScans] = React.useState<any[]>([]);

  React.useEffect(() => {
    function onUpdate(data: any) {
      console.log(data);
      setWinTimes(data.winTimes);
      setLastCodeScans(data.lastCodeScans);
    }

    socket.connect();
    socket.emit("admin");
    socket.on("update", onUpdate);
    return () => {
      socket.off("update", onUpdate);
    };
  }, []);

  return (
    <>
      <AdminReset />

      <AdminWrapper>
        <AdminGrid>
          <div>
            <h3>Today's Win Time Stats</h3>

            <AdminWinTimes>
              <thead>
                <tr>
                  <td>Win Time</td>
                  <td>Used</td>
                  <td>Used Time</td>
                </tr>
              </thead>
              <tbody>
                {winTimes.map((winTime) => {
                  return (
                    <tr key={winTime.id}>
                      <td>{formatTimestamp(winTime.timestamp)}</td>
                      <td>{winTime.used ? "Y" : "N"}</td>
                      <td>{formatTimestamp(winTime.usedAt) ?? "Never"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </AdminWinTimes>
          </div>

          <div>
            <h3>Recent Scans</h3>

            <AdminLastScan>
              <thead>
                <tr>
                  <td>Code</td>
                  <td>Guaranteed Win</td>
                  <td>Used Time</td>
                </tr>
              </thead>
              <tbody>
                {lastCodeScans.map((lastCodeScan) => {
                  return (
                    <tr key={lastCodeScan.id}>
                      <td>{lastCodeScan.code}</td>
                      <td>{lastCodeScan.guaranteedWin ? "Y" : "N"}</td>
                      <td>{formatTimestamp(lastCodeScan.usedAt) ?? "Never"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </AdminLastScan>
          </div>
        </AdminGrid>
      </AdminWrapper>
    </>
  );
}
