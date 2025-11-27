import React from "react";
import { Route, Routes } from "react-router-dom";
import SidebarMain from "../SideBar/SidebarMain";
import TopBar from "../TopBar/TopBar";
import Masters from "../../../Pages/masters/Masters";
import Dashboard from "../../../Pages/Dashboard/Dashboard";
import FbHome from "../../../Pages/facebook_clone/FbHome";
import "./HomePage.css";
import { Container } from "react-bootstrap";
import Reels from "../../../Pages/facebook_clone/Reels";
import MarketPlace from "../../../Pages/facebook_clone/MarketPlace";
import Groups from "../../../Pages/facebook_clone/Groups";
import Gaming from "../../../Pages/facebook_clone/Gaming";
import FbMainLayout from "../Fb_MainLayout/FbMainLayout";


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
            {/* Normal dashboard pages */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="masters" element={<Masters />} />

            {/* Parent Facebook Route */}
            <Route path="facebook" element={<FbMainLayout /> }>
              <Route index element={<FbHome />} />     {/* Main feed */}
              <Route path="reels" element={<Reels />} />
              <Route path="marketplace" element={<MarketPlace />} />
              <Route path="groups" element={<Groups />} />
              <Route path="gaming" element={<Gaming />} />
            </Route>
          </Routes>
        </div>



      </div>
    </div>
  );
}

export default HomePage;
