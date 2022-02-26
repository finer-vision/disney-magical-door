import React from "react";
import { Route, Routes } from "react-router-dom";
import { AppReset, AppWrapper } from "@/components/app/styles";

const Home = React.lazy(() => import("@/pages/home/home"));

export default function App() {
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
