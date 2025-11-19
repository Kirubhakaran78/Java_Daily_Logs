import React, { useState, useEffect } from "react";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getUserFromSession, logout as logoutUser } from "../../../utils/auth";
import { FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import './TopBar.css';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { CircleChevronDown } from 'lucide-react';

function TopBar() {
  const navigate = useNavigate();
  const currentUser = getUserFromSession();
  const [empId, setEmpId] = useState("N/A");

  useEffect(() => {
    // Fetch emp_id from employee table
    const fetchEmpId = async () => {
      try {
        const response = await axios.get("http://localhost:9092/Org_Management_java/api/masters/getAllEmp");
        const employees = response.data;
        
        // Find current user in employee table by name
        const currentEmployee = employees.find(
          emp => emp.emp_name === currentUser?.username
        );
        
        if (currentEmployee && currentEmployee.emp_id) {
          setEmpId(currentEmployee.emp_id);
        }
      } catch (error) {
        console.error("Error fetching emp_id:", error);
      }
    };

    if (currentUser?.username) {
      fetchEmpId();
    }
  }, [currentUser?.username]);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <Navbar bg="light" className="shadow-sm topbar" style={{ height: "60px" }}>
      <Container fluid>
        <Navbar.Brand className="mb-0 h1">
          Employee Management System
        </Navbar.Brand>

        <Nav className="ms-auto">
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="light"
              id="profile-dropdown"
              // id="dropdown-basic"
              style={{
                border: "none",
                padding: "4px 12px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "transparent",
              }}
            >
              <AccountCircleIcon
                style={{
                  fontSize: "40px",
                  color: "#0d0d0eff",
                }}
              />

              <span style={{ fontWeight: "500", color: "#333" }}>
                {currentUser?.username || "User"}
              </span>

              {/* <span style={{ fontSize: "12px", color: "#555" }}>▼</span> */}

              <CircleChevronDown style={{fontSize: "12px"}}/>
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ minWidth: "250px" }}>
              <Dropdown.Header>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "8px",
                  }}
                >
                  <AccountCircleIcon
                    style={{
                      fontSize: "40px",
                      color: "#0d0d0eff",
                    }}
                  />

                  <div>
                    <div style={{ fontWeight: "600", fontSize: "16px" }}>
                      {currentUser?.username || "User"}
                    </div>
                    <div className="text-muted" style={{ fontSize: "12px" }}>
                      {currentUser?.role || "EMPLOYEE"}
                    </div>
                  </div>
                  
                </div>
              </Dropdown.Header>

              <Dropdown.Divider />

              <div style={{ padding: "8px 16px" }}>
                <div style={{ fontSize: "13px", marginBottom: "6px" }}>
                  <strong>Emp ID:</strong> {empId}
                </div>
                <div style={{ fontSize: "13px", marginBottom: "6px" }}>
                  <strong>Role:</strong> {currentUser?.role || "EMPLOYEE"}
                </div>
                {currentUser?.product_name && (
                  <div style={{ fontSize: "13px" }}>
                    <strong>Product:</strong> {currentUser?.product_name}
                  </div>
                )}
              </div>

              <Dropdown.Divider />

              <Dropdown.Item
                onClick={handleLogout}
                style={{
                  color: "#dc3545",
                  fontWeight: "500",
                }}
                className="logout-item"
                onMouseDown={(e) => e.preventDefault()}
              >
                <FaSignOutAlt className="me-2" />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default TopBar;