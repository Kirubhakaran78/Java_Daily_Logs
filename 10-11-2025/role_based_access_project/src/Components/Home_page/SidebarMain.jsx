import React from 'react';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import "./SidebarMain.css"
import { LuNetwork } from 'react-icons/lu';
import { HouseDoorFill } from "react-bootstrap-icons";
import Dashboard from '../Home_Page_Original/Dashboard';
import { useNavigate } from "react-router-dom";


export default function SidebarMain() {

  const navigate = useNavigate();

  return (
    <Stack className="d-flex flex-column justify-content-between align-items-center py-3 sidebar-main"
      style={{ height: '100vh', width: '70px' }}>

      <div className="d-flex flex-column gap-3">

        {/* <Button variant="link"  onClick={() => navigate("/HomePage/dashboard")}>
          <HouseDoorFill size={28} className="sidebar-btn" />
        </Button>
        <span className='icon-pick-text-visible'>Home</span>


        <Button variant="link"  onClick={() => navigate("/HomePage/masters")}>
          <LuNetwork size={28} className="sidebar-btn" />
        </Button> */}

        <Button variant="link" className="sidebar-btn-wrapper" onClick={() => navigate("/HomePage/dashboard")}>
          <HouseDoorFill size={28} className="sidebar-btn" />
          <span className="sidebar-label">Home</span>
        </Button>

        <Button variant="link" className="sidebar-btn-wrapper" onClick={() => navigate("/HomePage/masters")}>
          <LuNetwork size={28} className="sidebar-btn" />
          <span className="sidebar-label">Masters</span>
        </Button>



      </div>





      {/* Botton icon
      <div className="d-flex flex-column gap-3">
        <Button variant="link" onClick={() => setActiveMenu('User_Management')} className="p-0 sidebar-btn">
          <FaUser size={28} />
        </Button>
      </div> */}

    </Stack>
  );
}
