import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import "./SidebarMain.css";
import { LuNetwork } from "react-icons/lu";
import { HouseDoorFill } from "react-bootstrap-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { Facebook, ThreeDots, X } from "react-bootstrap-icons";

export default function SidebarMain({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Force page reload function
  const handleNavigateAndReload = (path) => {
    if (location.pathname === path) {
      // If already on this page, force reload
      window.location.reload();
    } else {
      // Otherwise navigate normally
      navigate(path);
    }
  };

  return (
    <>
      {/* <Stack
        className="d-flex flex-column justify-content-between align-items-center sidebar-main"
        style={{ height: "100%", width: "70px", marginTop: "0px" }}
      > */}

      <Stack
        className={`d-flex flex-column justify-content-between align-items-center sidebar-main ${isOpen ? "show" : ""
          }`}
        style={{ height: "100%", width: "70px", marginTop: "0px" }}
      >
        <div className="d-flex flex-column gap-3" style={{ position: "relative" }}>
          {/* Close button */}
          <div style={{ position: "absolute",top:"-5px",right:"-2px" }}> 
          {/*top:"-10px",right:"-10px" */}
            <Button
              variant="link"
              className="d-lg-none text-white align-self-end mt-2"
              onClick={onClose} // Use onClose prop
              style={{ padding: "8px" }}
            >
              <X size={32} />
            </Button>
          </div>


          <Button
            variant="link"
            className={`sidebar-btn-wrapper ${location.pathname === "/HomePage/dashboard" ? "active" : ""
              }`}
            style={{ marginTop: "50px" }}
            onClick={() => navigate("/HomePage/dashboard")}
            onDoubleClick={() => {
              if (location.pathname === "/HomePage/dashboard") {
                window.location.reload();
              }
            }}
          >
            <HouseDoorFill size={28} className="sidebar-btn" />
            <span className="sidebar-label">Home</span>
          </Button>

          <Button
            variant="link"
            className={`sidebar-btn-wrapper ${location.pathname === "/HomePage/masters" ? "active" : ""
              }`}
            onClick={() => navigate("/HomePage/masters")}
            onDoubleClick={() => {
              if (location.pathname === "/HomePage/masters") {
                window.location.reload();
              }
            }}
          >
            <LuNetwork size={28} className="sidebar-btn" />
            <span className="sidebar-label text-masters">Masters</span>
          </Button>

          <Button
            variant="link"
            className={`sidebar-btn-wrapper ${location.pathname.startsWith("/HomePage/facebook") ? "active" : ""
              }`}
            onClick={() => navigate("/HomePage/facebook")}
            onDoubleClick={() => {
              if (location.pathname.startsWith("/HomePage/facebook")) {
                window.location.reload();
              }
            }}
          >
            <Facebook size={28} className="sidebar-btn" />
            <span className="sidebar-label text-masters">Facebook</span>
          </Button>
        </div>
      </Stack>
    </>
  );
}
