import React from 'react'
import { Form } from 'react-bootstrap'
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import { Search } from 'react-bootstrap-icons';
import { Menu, MessageCirclePlus, Bell } from 'lucide-react';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { getUserFromSession, logout as logoutUser } from "../../../utils/auth";
import { FaSignOutAlt } from "react-icons/fa";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { CircleChevronDown } from 'lucide-react';
import axios from "axios";
import chevron_down from "../../../assets/icons/chevron_down.png";
import fb_profile from "../../../assets/icons/fb_profile3.jpg";
import "./FbTopBar.css"


function FbTopBar() {
    const navigate = useNavigate();
    const handleLogout = () => {
        logoutUser();
        navigate("/");
    };

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


                        <Dropdown align="end">
                            <Dropdown.Toggle variant="light" style={{ backgroundColor: "#E2E5E9", padding: "10px", borderRadius: "50px" }}>

                                <Menu style={{
                                    fontSize: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                }} />

                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Header>
                                    <h3>Menu</h3>
                                </Dropdown.Header>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Dropdown align="end">
                            <Dropdown.Toggle variant="light" style={{ backgroundColor: "#E2E5E9", padding: "10px", borderRadius: "50px" }}>

                                <img src="https://img.icons8.com/?size=100&id=60663&format=png&color=000000" alt="messenger" width={24} height={24}

                                />

                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Header>
                                    <h3>Messenger</h3>
                                </Dropdown.Header>
                            </Dropdown.Menu>
                        </Dropdown>




                        <Dropdown align="end">
                            <Dropdown.Toggle variant="light" style={{ backgroundColor: "#E2E5E9", padding: "10px", borderRadius: "50px" }}>

                                <Bell style={{
                                    fontSize: "40px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                }}
                                />

                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Header>
                                    <h3>Notifications</h3>
                                    {/* open the three dots */}
                                    
                                        <div style={{
                                            position: "absolute",
                                            left: "950px",
                                            right: "0px",
                                            marginTop: "50px",
                                            width: "300px",
                                            background: "white",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                            borderRadius: "8px",
                                            zIndex: 999,
                                            padding: "8px"
                                        }}>
                                            <div style={{ padding: "10px", cursor: "pointer" }}
                                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f2f5")}
                                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                               
                                            >
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                    {/* <CirclePlus /> <span style={{ fontWeight: "600" }}>  Interested</span> <br /> */}
                                                </div>
                                                <span>More of your posts will be like this</span>
                                            </div>

                                            <div style={{ padding: "10px", cursor: "pointer" }}
                                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f2f5")}
                                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                                
                                            >
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                    {/* <CircleMinus />  <span style={{ fontWeight: "600" }}> Not Interested</span> */}
                                                </div>

                                                <span>Fewer of your posts will be like this </span></div>
                                        </div>
                                    
                                </Dropdown.Header>
                            </Dropdown.Menu>
                        </Dropdown>



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


                                    <img src={fb_profile} alt="fb_profile" height={40} width={40} style={{ borderRadius: "50%" }} />

                                    <div style={{ backgroundColor: "#E2E5E9", padding: "3px", borderRadius: "45px", position: "absolute", left: "24px", top: "25px", border: "2px solid white" }}>
                                        <img src={chevron_down} alt="chevron down" style={{ width: "6px", height: "6px" }} />
                                    </div>
                                </div>
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{ minWidth: "250px" }}>
                                <Dropdown.Header>
                                    <div style={{ borderRadius: '10px', boxShadow: "0px 3px 3px 1px rgba(148, 148, 148, 0.5)", padding: "12px", marginBottom: "18px" }}>

                                        {/* Profile Card */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "12px",
                                                marginBottom: "8px",
                                                padding: "8px"
                                            }}
                                        >
                                            <img src={fb_profile} alt="fb_profile" height={40} width={40} style={{ borderRadius: "50%" }} /> <span style={{ fontWeight: "bold", color: "#080809", fontSize: "17px" }}>Peter</span>
                                        </div>
                                        <hr />
                                        <div >
                                            <button className="profile-btn" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                <span className="fb-sprite-icon"></span>
                                                <span className="btn-text">See All Profiles</span>
                                            </button>
                                        </div>


                                    </div>

                                    {/* Sub menus */}
                                    <div style={{
                                        fontWeight: "500",
                                        color: "#080809",
                                        padding: "8px",
                                        display: "flex",
                                        justifyContent: "start",
                                        alignItems: "center",
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = "#edeef0ff";
                                            e.currentTarget.style.borderRadius = "10px";
                                        }}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div style={{
                                                backgroundColor: "#E2E5E9",
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}>
                                                <img src="https://img.icons8.com/?size=100&id=2969&format=png&color=000000" alt="settings" width={20} height={20} />

                                            </div>
                                            <span style={{ marginLeft: "8px", fontSize: "15px", fontWeight: "600" }}>Settings & Privacy</span>
                                            <span
                                                style={{
                                                    backgroundImage:
                                                        'url("https://static.xx.fbcdn.net/rsrc.php/v4/yv/r/zY1TekFCJ__.png")',
                                                    backgroundPosition: "0px -100px",
                                                    backgroundSize: "auto",
                                                    width: "24px",
                                                    height: "24px",
                                                    backgroundRepeat: "no-repeat",
                                                    display: "inline-block",
                                                    marginLeft: "110px"
                                                }}
                                            ></span>
                                        </div>
                                    </div>



                                    <div style={{
                                        fontWeight: "500",
                                        color: "#080809",
                                        padding: "8px",
                                        display: "flex",
                                        justifyContent: "start",
                                        alignItems: "center",
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = "#edeef0ff";
                                            e.currentTarget.style.borderRadius = "10px";
                                        }}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div style={{
                                                backgroundColor: "#E2E5E9",
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}>
                                                <img src="https://img.icons8.com/?size=100&id=2908&format=png&color=000000" alt="settings" width={20} height={20} />

                                            </div>
                                            <span style={{ marginLeft: "8px", fontSize: "15px", fontWeight: "600" }}>Help & support</span>
                                            <span
                                                style={{
                                                    backgroundImage:
                                                        'url("https://static.xx.fbcdn.net/rsrc.php/v4/yv/r/zY1TekFCJ__.png")',
                                                    backgroundPosition: "0px -100px",
                                                    backgroundSize: "auto",
                                                    width: "24px",
                                                    height: "24px",
                                                    backgroundRepeat: "no-repeat",
                                                    display: "inline-block",
                                                    marginLeft: "130px",
                                                    color: "#E2E5E9"
                                                }}
                                            ></span>
                                        </div>
                                    </div>




                                    <div style={{
                                        fontWeight: "500",
                                        color: "#080809",
                                        padding: "8px",
                                        display: "flex",
                                        justifyContent: "start",
                                        alignItems: "center",
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = "#edeef0ff";
                                            e.currentTarget.style.borderRadius = "10px";
                                        }}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>


                                            <div style={{
                                                backgroundColor: "#E2E5E9",
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}>
                                                <img src="https://img.icons8.com/?size=100&id=59841&format=png&color=000000" alt="settings" width={20} height={20} />

                                            </div>
                                            <span style={{ marginLeft: "8px", fontSize: "15px", fontWeight: "600" }}>Display and accessibility</span>
                                            <span
                                                style={{
                                                    backgroundImage:
                                                        'url("https://static.xx.fbcdn.net/rsrc.php/v4/yv/r/zY1TekFCJ__.png")',
                                                    backgroundPosition: "0px -100px",
                                                    backgroundSize: "auto",
                                                    width: "24px",
                                                    height: "24px",
                                                    backgroundRepeat: "no-repeat",
                                                    display: "inline-block",
                                                    marginLeft: "70px",
                                                    color: "#E2E5E9"
                                                }}
                                            ></span>
                                        </div>
                                    </div>




                                    <div style={{
                                        fontWeight: "500",
                                        color: "#080809",
                                        padding: "8px",
                                        display: "flex",
                                        justifyContent: "start",
                                        alignItems: "center",
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = "#edeef0ff";
                                            e.currentTarget.style.borderRadius = "10px";
                                        }}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}
                                    >
                                        <div style={{
                                            backgroundColor: "#E2E5E9",
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}>
                                            <span
                                                style={{
                                                    backgroundImage: "url('https://static.xx.fbcdn.net/rsrc.php/v4/y5/r/mVfnqkD1Z7J.png')",
                                                    backgroundPosition: "0px -67px",
                                                    backgroundRepeat: "no-repeat",
                                                    width: "20px",
                                                    height: "20px",
                                                    display: "inline-block"
                                                }}
                                            ></span>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <span style={{ marginLeft: "8px", fontSize: "15px", fontWeight: "600", color: "#080809" }}>Give Feedback</span>
                                            <span style={{ marginLeft: "8px", fontSize: 13, color: "#080809", fontWeight: "normal" }}>CTRL B</span>
                                        </div>
                                    </div>


                                    <div style={{
                                        fontWeight: "500",
                                        color: "#080809",
                                        padding: "8px",
                                        display: "flex",
                                        justifyContent: "start",
                                        alignItems: "center",
                                    }}
                                        onClick={handleLogout}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = "#edeef0ff";
                                            e.currentTarget.style.borderRadius = "10px";
                                        }}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ffffff"}
                                        onMouseDown={(e) => e.preventDefault()}
                                    >
                                        <div style={{
                                            backgroundColor: "#E2E5E9",
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}>
                                            <span
                                                style={{
                                                    backgroundImage: "url('https://static.xx.fbcdn.net/rsrc.php/v4/y5/r/mVfnqkD1Z7J.png')",
                                                    backgroundPosition: "0px -109px",
                                                    backgroundRepeat: "no-repeat",
                                                    width: "20px",
                                                    height: "20px",
                                                    display: "inline-block"
                                                }}
                                            ></span>

                                        </div>
                                        <span style={{ marginLeft: "8px", fontSize: "15px", fontWeight: "600" }}>Logout</span>
                                    </div>

                                    <div style={{ color: "#65686C", fontSize: "13px" }}
                                    >
                                        <span className="end-text">Privacy</span> · <span className="end-text">Terms</span> · <span className="end-text">Advertising</span>  · <span className="end-text">Ad Choices</span> · <span className="end-text">Cookies</span> · <br /><span className="end-text">More</span>
                                    </div>

                                </Dropdown.Header>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Container>
            </Navbar >

        </div >
    )
}

export default FbTopBar

