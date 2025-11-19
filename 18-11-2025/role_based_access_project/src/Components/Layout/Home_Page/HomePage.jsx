import React from "react";
import { Route, Routes } from "react-router-dom";
import SidebarMain from "../SideBar/SidebarMain";
import TopBar from "../TopBar/TopBar";
import Masters from "../../../Pages/masters/Masters";
import Dashboard from "../../../Pages/Dashboard/Dashboard";
import FbHome from "../../../Pages/facebook_clone/FbHome";
import "./HomePage.css";
import { Container } from "react-bootstrap";


function HomePage() {
  return (
    <div className="home_page">
      {/* Top Bar */}
      <TopBar />

      {/* Main Layout */}
      <div className="d-flex" >

        <SidebarMain />
        {/* <Sidebar/> */}

        {/* inside HomePage component replace inline style main content div with: */}
        <div className="main-content">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="masters" element={<Masters />} />
            <Route path="facebook" element={<FbHome />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
