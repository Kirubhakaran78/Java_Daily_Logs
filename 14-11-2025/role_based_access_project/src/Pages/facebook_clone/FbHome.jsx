import React from 'react'
import FbTopBar from './FbTopBar'
import { Form } from 'react-bootstrap'
import InputGroup from 'react-bootstrap/InputGroup';
import Col from 'react-bootstrap/Col';
import { Search } from 'react-bootstrap-icons';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Video } from 'lucide-react';

function FbHome() {
    return (
        <div>
            <FbTopBar />

            <div
                style={{
                    padding: "20px",
                    backgroundColor: "#be4040ff",
                    width: "100%",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    // alignItems: "center",
                }}>

                <div style={{
                    backgroundColor: "#ffffffff", width: "750px", height: "80px", padding: "10px", borderRadius: "8px", display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "20px"
                }}>
                    <AccountCircleIcon
                        style={{
                            fontSize: "60px",
                            color: "#1d6103ff",
                        }}
                    />

                    <input type="text" placeholder='Whats on your mind,Kirubha?' style={{ borderRadius: "27px", background: "#f3ededff", width: "450px", height: "55px", color: "#65686C", fontSize: "17px", padding: "10px", fontFamily: "Segoe UI Historic", border: "none" }} />

                    <img src="https://static.xx.fbcdn.net/rsrc.php/v4/yr/r/c0dWho49-X3.png" alt="live video icon" />
                    <img src="https://static.xx.fbcdn.net/rsrc.php/v4/y7/r/Ivw7nhRtXyo.png" alt="video image icon" />
                    <img src="https://static.xx.fbcdn.net/rsrc.php/v4/yd/r/Y4mYLVOhTwq.png" alt="smile image" />

                </div>

            </div>

            <div style={{
                    padding: "20px",
                    backgroundColor: "#61f068ff",
                    width: "700px",
                    height: "200px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>

                <div style={{ width: "112.5px", height: "200px", background: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "10px", marginLeft: "20px", borderRadius: "8px" }}>

                </div>

                <div style={{ width: "112.5px", height: "200px", background: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "10px", marginLeft: "20px", borderRadius: "8px" }}>

                </div>


                <div style={{ width: "112.5px", height: "200px", background: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "10px", marginLeft: "20px", borderRadius: "8px" }}>

                </div>


                <div style={{ width: "112.5px", height: "200px", background: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "10px", marginLeft: "20px", borderRadius: "8px" }}>

                </div>

                <div style={{ width: "112.5px", height: "200px", background: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "10px", marginLeft: "20px", borderRadius: "8px" }}>

                </div>

                <div style={{ width: "112.5px", height: "200px", background: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "10px", marginLeft: "20px", borderRadius: "8px" }}>

                </div>
            </div>




        </div>
    )
}

export default FbHome
