import { Outlet } from "react-router-dom";
import React from "react";
import "./RootLayout.scss";

function RootLayout() {
  return (
    <div className="rootLayout">
      <main className="rootMain">
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayout;
