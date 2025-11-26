import React from 'react'
import fb_profile from "../../assets/icons/fb_profile3.jpg";
import './StoryView.css';
import TopRightIcons from '../../Components/Layout/TopBar/FbTopRightIcons';
import { Dropdown } from 'react-bootstrap';

function CreateStory({ close }) {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "#F2F4F7",
      display: "flex",
      zIndex: 9999
    }}>
      {/* Left Sidebar */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "10px 16px",
          width: "360px",
          height: "100vh", overflowY: "auto"
        }}

      >
        {/* close button */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

          <div className="fb-close-wrapper" onClick={close}>
            <button className="fb-close-btn" ></button>
          </div>

          <img src="https://www.facebook.com/images/fb_icon_325x325.png" alt="Facebook Logo" style={{ height: '40px', marginRight: "14px" }} />

        </div>

        {/* HR Line */}
        <hr style={{
          width: "100%",
          border: "none",
          height: "2px",
          backgroundColor: "#CED0D4",
        }} />


        <div style={{display:"flex", justifyContent:"space-between",alignItems:"center"}}>
          <h4 style={{ fontWeight: "700" }}>Your Story</h4>
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" style={{ backgroundColor: "#E2E5E9", padding: "8px", borderRadius: "50px" }}>

              <img src="https://img.icons8.com/?size=100&id=2969&format=png&color=000000" alt="settings" width={24} height={24}

              />

            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Header>
                <h3>Settings</h3>
              </Dropdown.Header>
            </Dropdown.Menu>
          </Dropdown>
        </div>



        <div>
          <div style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "12px", cursor: "pointer", marginTop: "25px" }}>

            <img src={fb_profile} alt='fb_profile pic' width={65} height={65} style={{ borderRadius: "50%", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" }}></img>

            <div >
              <span style={{ fontSize: "17px", fontWeight: "600" }}>Peter</span>

            </div>

          </div>
        </div>

        {/* HR Line */}
        <hr style={{
          width: "100%",
          border: "none",
          height: "2px",
          backgroundColor: "#CED0D4",
          margin: "25px 0 20px 0"
        }} />
      </div>

      {/* Add this wrapper around TopRightIcons */}
      <div style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        zIndex: 10000
      }}>
        <TopRightIcons />
      </div>

    </div>
  )
}

export default CreateStory
