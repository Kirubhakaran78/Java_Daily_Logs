import React from 'react';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUserFromSession, logout as logoutUser } from '../../utils/auth';
import { FaBars, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './TopBar.css';

function TopBar() {
  const navigate = useNavigate();
  const currentUser = getUserFromSession();
  
  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <Navbar bg="light" className="shadow-sm topbar" style={{ height: '60px' }}>
      <Container fluid>
        {/* Left side - Title */}
        <Navbar.Brand className="mb-0 h1">
          Employee Management System
        </Navbar.Brand>

        {/* Right side - Hamburger Menu with Dropdown */}
        <Nav className="ms-auto">
          <Dropdown align="end">
            <Dropdown.Toggle 
              variant="light" 
              id="hamburger-dropdown"
              style={{ 
                border: 'none',
                fontSize: '24px',
                padding: '8px 12px'
              }}
            >
              <FaBars />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Header>
                <div><strong>{currentUser?.username || 'User'}</strong></div>
                <div className="text-muted" style={{ fontSize: '12px' }}>
                  Emp ID: {currentUser?.id || 'N/A'}
                </div>
                <div className="text-muted" style={{ fontSize: '12px' }}>
                  Role: {currentUser?.role || 'EMPLOYEE'}
                </div>
                {currentUser?.product_name && (
                  <div className="text-muted" style={{ fontSize: '12px' }}>
                    Product: {currentUser?.product_name}
                  </div>
                )}
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
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