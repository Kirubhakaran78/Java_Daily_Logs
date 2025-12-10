import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import Col from "react-bootstrap/Col";
import { Search } from "react-bootstrap-icons";
import { Menu, MessageCirclePlus, Bell } from "lucide-react";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { getUserFromSession, logout as logoutUser } from "../../../utils/auth";
import { FaSignOutAlt } from "react-icons/fa";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { CircleChevronDown } from "lucide-react";
import axios from "axios";
import chevron_down from "../../../assets/icons/chevron_down.png";
import fb_profile from "../../../assets/icons/fb_profile3.jpg";
import "./FbTopBar.css";
import TopRightIcons from "./FbTopRightIcons";
import { NavLink } from "react-router-dom";
import {
  GamingIcon,
  GroupsIcon,
  HomeIcon,
  MarketplaceIcon,
  PlayIcon,
} from "./FbNavIcons";

function FbTopBar({ onMenuClick }) {
  

  return (
    <div style={{ position: 'relative' }}>
      <Navbar
        bg="light"
        className="shadow-sm topbar"
        style={{ height: "60px" }}
      >
        <Container
          fluid
          className="d-flex align-items-center justify-content-between flex wrap"
        >
          {/* LEFT SECTION */}
          <div className="d-flex align-items-center" style={{ gap: "12px" }}>
            {/* Menu Button */}
            <Button
              variant="link"
              className="hamburger-menu p-0"
              onClick={onMenuClick}
              style={{ color: "#050505" }}
            >
              <Menu size={28} />
            </Button>
            <img
              src="https://www.facebook.com/images/fb_icon_325x325.png"
              alt="Facebook Logo"
              style={{ height: "40px" }}
            />

            <InputGroup style={{ width: "240px" }}>
              <Form.Control
                type="text"
                placeholder=" 🔍︎ Search Facebook"
                style={{ borderRadius: "25px" }}
              />
            </InputGroup>
          </div>

          {/* CENTER NAV LINKS */}
          <Nav className="fb-center-nav">
            <Nav.Link
              as={NavLink}
              to="/HomePage/facebook"
              className="fb-nav-link"
              end
            >
              {({ isActive }) => (
                <HomeIcon fill={isActive ? "#0866ff" : "#65676b"} />
              )}
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/HomePage/facebook/reels"
              className="fb-nav-link"
            >
              {({ isActive }) => (
                <PlayIcon fill={isActive ? "#0866ff" : "#65676b"} />
              )}
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/HomePage/facebook/marketplace"
              className="fb-nav-link"
            >
              {({ isActive }) => (
                <MarketplaceIcon fill={isActive ? "#0866ff" : "#65676b"} />
              )}
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/HomePage/facebook/groups"
              className="fb-nav-link"
            >
              {({ isActive }) => (
                <GroupsIcon fill={isActive ? "#0866ff" : "#65676b"} />
              )}
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/HomePage/facebook/gaming"
              className="fb-nav-link"
            >
              {({ isActive }) => (
                <GamingIcon fill={isActive ? "#0866ff" : "#65676b"} />
              )}
            </Nav.Link>
          </Nav>

          {/* RIGHT ICONS */}
          <TopRightIcons />
        </Container>
      </Navbar>
      <div className="topbar-spacer"></div>
    </div>
  );
}

export default FbTopBar;
