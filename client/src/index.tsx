import React from "react";
import { render } from "react-dom";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import App from "@/components/app/app";
import Admin from "@/components/admin/admin";

render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.querySelector("#root")
);
