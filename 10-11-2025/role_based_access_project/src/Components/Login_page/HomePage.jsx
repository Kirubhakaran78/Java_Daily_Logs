import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SidebarMain from "../Home_page/SidebarMain"
import Button from 'react-bootstrap/Button';
import { Route, Routes } from 'react-router-dom'
import Dashboard from "../Home_Page_Original/Dashboard";
import Masters from "../Home_Page_Original/masters/Masters";
import UserMaster from '../Home_Page_Original/masters/UserMaster';

function HomePage() {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.setItem("isLoggedIn", "false");
        navigate("/")
    }

    return (
        <div className='home_page'>
            <Button className="position-absolute top-0 end-0 m-2" style={{ backgroundColor: "red", color: "white", padding: "10px", border: "none", borderRadius: "5px" }} onClick={logout}>Logout</Button>

            <div className="d-flex">
                {/* Sidebar (fixed width) */}
                <div style={{ width: "80px", height: "100vh" }}>
                    <SidebarMain />
                </div>

                {/* Main content area */}
                <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
                    <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="masters" element={<UserMaster />} />
                    </Routes>
                </div>
            </div>



        </div>
    )
}

export default HomePage
