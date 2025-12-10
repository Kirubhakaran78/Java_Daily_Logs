import React from "react";
import { Outlet } from "react-router-dom";
import FbTopBar from "../TopBar/FbTopBar";

function FbMainLayout({ onMenuClick }) {
  return (
    <div>
      <FbTopBar onMenuClick={onMenuClick} />
      
        <Outlet />
     
    </div>
  );
}

export default FbMainLayout;
