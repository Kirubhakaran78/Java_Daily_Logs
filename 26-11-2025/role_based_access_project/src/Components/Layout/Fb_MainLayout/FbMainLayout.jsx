import React from "react";
import { Outlet } from "react-router-dom";
import FbTopBar from "../TopBar/FbTopBar";


function FbMainLayout() {
    return (
        <div>
            <FbTopBar />

            <Outlet />

        </div>
    );
}

export default FbMainLayout;
