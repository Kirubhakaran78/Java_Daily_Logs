import React from 'react'

import { Form } from 'react-bootstrap'
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import { Search } from 'react-bootstrap-icons';
import { Menu, MessageCirclePlus, Bell } from 'lucide-react';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { getUserFromSession, logout as logoutUser } from "../../utils/auth";
import { FaSignOutAlt } from "react-icons/fa";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { CircleChevronDown } from 'lucide-react';
import axios from "axios";
import chevron_down from "../../assets/icons/chevron_down.png";
import fb_profile from "../../assets/icons/fb_profile.jpg";


function FbTopBar() {
    return (
        <div >
            <Navbar bg="light" className="shadow-sm topbar" style={{ height: "60px" }}>
                <Container fluid>
                    <img src="https://www.facebook.com/images/fb_icon_325x325.png" alt="Facebook Logo" style={{ height: '40px', marginRight: "14px" }} />
                    <Form.Group as={Col} md="2" controlId="validationCustomUsername" >

                        <InputGroup hasValidation>
                            {/* <InputGroup.Text id="inputGroupPrepend" ><Search /></InputGroup.Text> */}
                            <Form.Control
                                type="text"
                                placeholder=" 🔍︎ Search Facebook"
                                aria-describedby="inputGroupPrepend"
                                style={{ borderRadius: "25px" }}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please choose a username.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    <Nav className="ms-auto" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                        <div style={{ backgroundColor: "#E2E5E9", padding: "10px", borderRadius: "50px" }}>
                            <Menu style={{
                                fontSize: "20px",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                            }} />
                        </div>

                        <div style={{ backgroundColor: "#E2E5E9", padding: "10px", borderRadius: "50px" }}>
                            <MessageCirclePlus style={{
                                fontSize: "40px",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                            }} />
                        </div>


                        <div style={{ backgroundColor: "#E2E5E9", padding: "10px", borderRadius: "50px" }}>
                            <Bell style={{
                                fontSize: "40px",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                            }} />
                        </div>
                        <Dropdown align="end">
                            <Dropdown.Toggle
                                variant="light"
                                id="profile-dropdown"

                                style={{
                                    border: "none",
                                    padding: "4px 12px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "2px",
                                    backgroundColor: "transparent",
                                }}
                            >
                                <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "10px" }}>
                                    {/* <AccountCircleIcon
                                        style={{
                                            fontSize: "40px",
                                            color: "#0d0d0eff",
                                        }}
                                    /> */}

                                    <img src={fb_profile} alt="fb_profile" height={40} width={40} style={{borderRadius:"50%"}} />

                                    <div style={{ backgroundColor: "#E2E5E9", padding: "3px", borderRadius: "45px", position: "absolute", left: "23px", top: "23px", border: "2px solid white" }}>
                                        <img src={chevron_down} alt="chevron down" style={{ width: "6px", height: "6px" }} />
                                    </div>


                                    {/* <CircleChevronDown style={{ fontSize: "5px",position:"absolute",left:"25px",top:"20px" }} /> */}
                                </div>
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



                                    </div>
                                </Dropdown.Header>

                                <Dropdown.Divider />


                                <Dropdown.Divider />

                                <Dropdown.Item

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
            </Navbar >

        </div >
    )
}

export default FbTopBar

