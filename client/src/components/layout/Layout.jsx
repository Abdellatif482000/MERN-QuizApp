import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="">
      <Navbar />
      <div
        className="
          mt-[72px]
          h-screen
          bg-teal-900
          z-10
        "
      >
        <Outlet />
      </div>
    </div>
  );
}
