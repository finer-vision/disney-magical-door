import React from "react";
import { Route, Routes } from "react-router-dom";
import { AppReset, AppWrapper } from "@/components/app/styles";
import socket from "@/services/socket";

const Home = React.lazy(() => import("@/pages/home/home"));

export default function App() {
  React.useEffect(() => {
    function onData() {
      console.log("onData");
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
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </AppWrapper>
    </React.Suspense>
  );
}
