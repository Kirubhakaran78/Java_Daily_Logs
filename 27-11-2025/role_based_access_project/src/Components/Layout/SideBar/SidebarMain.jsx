import React from 'react';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import "./SidebarMain.css"
import { LuNetwork } from 'react-icons/lu';
import { HouseDoorFill } from "react-bootstrap-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { Facebook } from 'react-bootstrap-icons';


export default function SidebarMain() {

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Stack className="d-flex flex-column justify-content-between align-items-center sidebar-main"
      style={{ height: '100vh', width: '70px', marginTop: '0px' }}>

      <div className="d-flex flex-column gap-3">
        <Button variant="link" className={`sidebar-btn-wrapper ${location.pathname === "/HomePage/dashboard" ? "active" : ""}`} onClick={() => navigate("/HomePage/dashboard")}>
          <HouseDoorFill size={28} className="sidebar-btn" />
          <span className="sidebar-label">Home</span>
        </Button>

        <Button variant="link" className={`sidebar-btn-wrapper ${location.pathname === "/HomePage/masters" ? "active" : ""}`} onClick={() => navigate("/HomePage/masters")}>
          <LuNetwork size={28} className="sidebar-btn" />
          <span className="sidebar-label text-masters">Masters</span>
        </Button>

        <Button
          variant="link"
          className={`sidebar-btn-wrapper ${location.pathname.startsWith("/HomePage/facebook") ? "active" : ""}`}
          onClick={() => navigate("/HomePage/facebook")}
        >
          <Facebook size={28} className="sidebar-btn" />
          <span className="sidebar-label text-masters">Facebook</span>
        </Button>






      </div>

    </Stack>
  );
}
