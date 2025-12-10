import React,{useState} from "react";
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
import UserProfilePage from "../../../Pages/facebook_clone/profile_page/UserProfilePage";
import CreateStory from "../../../features/stories/CreateStory";
import StoryView from "../../../features/stories/StoryView";


function HomePage() {

  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <div className="home_page">
      {/* Top Bar */}
      <TopBar />

      {/* Main Layout */}
      <div className="d-flex" >

        <SidebarMain 
          isOpen={showSidebar} 
          onClose={() => setShowSidebar(false)} 
        />
        {/* <Sidebar/> */}

        {/* inside HomePage component replace inline style main content div with: */}
        <div className="main-content">

          <Routes>
            {/* Normal dashboard pages */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="masters" element={<Masters />} />

            {/* Parent Facebook Route */}
            <Route path="facebook" element={<FbMainLayout onMenuClick={() => setShowSidebar(true)} /> }>
              <Route index element={<FbHome />} />     {/* Main feed */}
              <Route path="reels" element={<Reels />} />
              <Route path="marketplace" element={<MarketPlace />} />
              <Route path="groups" element={<Groups />} />
              <Route path="gaming" element={<Gaming />} />
              <Route path="Create_Story" element={<CreateStory />} />
              {/* <Route path="View_Story/:storyId" element={<StoryView />} /> */}
              <Route path="profile" element={<UserProfilePage />} />

            </Route>
          </Routes>
        </div>



      </div>
    </div>
  );
}

export default HomePage;
