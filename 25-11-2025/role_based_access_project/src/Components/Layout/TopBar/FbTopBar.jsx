import React from 'react'
import { Form } from 'react-bootstrap'
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import { Search } from 'react-bootstrap-icons';
import { Menu, MessageCirclePlus, Bell } from 'lucide-react';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { getUserFromSession, logout as logoutUser } from "../../../utils/auth";
import { FaSignOutAlt } from "react-icons/fa";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { CircleChevronDown } from 'lucide-react';
import axios from "axios";
import chevron_down from "../../../assets/icons/chevron_down.png";
import fb_profile from "../../../assets/icons/fb_profile3.jpg";
import "./FbTopBar.css"
import TopRightIcons from './FbTopRightIcons';


function FbTopBar() {


    return (
        <div >
            <Navbar bg="light" className="shadow-sm topbar" style={{ height: "60px" }}>
                <Container fluid>
                    <img src="https://www.facebook.com/images/fb_icon_325x325.png" alt="Facebook Logo" style={{ height: '40px', marginRight: "14px" }} />


                    <InputGroup style={{ width: "240px" }}>

                        <Form.Control
                            type="text"
                            placeholder=" 🔍︎ Search Facebook"
                            aria-describedby="inputGroupPrepend"
                            style={{ borderRadius: "25px" }}
                            required
                        />
                    </InputGroup>

                    {/* Spacer to push icons to the right */}
                    <div style={{ flex: 1 }}></div>

                    {/* Nav Links */}

                    {/* Top Right icons */}
                    <TopRightIcons />
                </Container>
            </Navbar >

        </div >
    )
}

export default FbTopBar

