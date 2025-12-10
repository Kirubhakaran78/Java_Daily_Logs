import React, { useState, useEffect, useRef } from "react";
import { Form } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import Col from "react-bootstrap/Col";
import { Search } from "react-bootstrap-icons";
import { Menu, MessageCirclePlus, Bell } from "lucide-react";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getUserFromSession, logout as logoutUser } from "../../../utils/auth";
import { FaSignOutAlt } from "react-icons/fa";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { CircleChevronDown } from "lucide-react";
import axios from "axios";
import chevron_down from "../../../assets/icons/chevron_down.png";
// import fb_profile from "../../../assets/icons/fb_profile3.jpg";
import "./FbTopBar.css";
import { useUser } from "../../../context/UserProvider";
import { config } from "../../../services/api";

function TopRightIcons() {
  const navigate = useNavigate();

  const defaultPic =
    "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg";

  const [showSettings, setShowSettings] = useState(false);

  const [alertMsg, setAlertMsg] = useState(null);
  const [alertType, setAlertType] = useState("success"); // "success" or "error"

  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
  };

  const { user, profilePic, setProfilePic, updateUser, empId } = useUser();

  console.log(user);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
    window.location.href = "/Org_Management_reactjs/";
  };

  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  // CLICK OPEN FILE PICKER
  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  // WHEN FILE SELECTED
  const onSelectFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    uploadProfilePic(file);
  };

  const uploadProfilePic = async (file) => {
    setUploading(true);

    const form = new FormData();
    form.append("file", file);

    try {
      // Get the correct numeric employee ID
      const empResponse = await axios.get(
        `http://localhost:8082/Org_Management_java/api/masters/getAllEmp`
      );

      const currentEmployee = empResponse.data.find(
        (emp) => emp.emp_name === user.username
      );

      if (!currentEmployee || !currentEmployee.id) {
        alert("Employee not found!");
        setUploading(false);
        return;
      }

      console.log(
        "Uploading for employee:",
        currentEmployee.emp_name,
        "ID:",
        currentEmployee.id
      );

      // Upload to backend
      const res = await axios.post(
        `http://localhost:8082/Org_Management_java/api/masters/${currentEmployee.id}/upload-profile`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Upload response:", res.data);

      // Create URL with cache buster
      const newUrl = `${res.data}?v=${Date.now()}`;

      // Update context state
      setProfilePic(newUrl);

      // Update user object
      const updatedUser = { ...user, profilePic: newUrl };
      updateUser(updatedUser);

      setAlertType("success");
      setAlertMsg("Profile picture updated successfully!");
      setTimeout(() => setAlertMsg(null), 3000);
    } catch (err) {
      console.error("Upload failed:", err);
      setAlertType("error");
      setAlertMsg("Failed to update profile picture: " + err.message);
      setTimeout(() => setAlertMsg(null), 3000);
    }

    setUploading(false);
  };



  return (
    <div>
      {alertMsg && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "12px 18px",
            borderRadius: "6px",
            color: "white",
            backgroundColor: alertType === "success" ? "green" : "red",
            zIndex: 9999,
          }}
        >
          {alertMsg}
        </div>
      )}

      <Nav
        className="ms-auto"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {/* <Nav className="ms-auto top-right-icons"> */}

        <Dropdown align="end">
          <Dropdown.Toggle
            variant="light"
            style={{
              backgroundColor: "#E2E5E9",
              padding: "8px",
              borderRadius: "50px",
            }}
          >
            <Menu
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
              size={22}
            />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Header>
              <h3>Menu</h3>
            </Dropdown.Header>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown align="end">
          <Dropdown.Toggle
            variant="light"
            style={{
              backgroundColor: "#E2E5E9",
              padding: "8px",
              borderRadius: "50px",
            }}
          >
            <img
              src="https://img.icons8.com/?size=100&id=60663&format=png&color=000000"
              alt="messenger"
              width={24}
              height={24}
            />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Header>
              <h3>Messenger</h3>
            </Dropdown.Header>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown align="end">
          <Dropdown.Toggle
            variant="light"
            style={{
              backgroundColor: "#E2E5E9",
              padding: "8px",
              borderRadius: "50px",
            }}
          >
            <Bell
              style={{
                fontSize: "40px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              size={22}
            />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Header>
              <h3>Notifications</h3>
              {/* open the three dots */}

              <div
                style={{
                  position: "absolute",
                  left: "950px",
                  right: "0px",
                  marginTop: "50px",
                  width: "300px",
                  background: "white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  borderRadius: "8px",
                  zIndex: 999,
                  padding: "8px",
                }}
              >
                <div
                  style={{ padding: "10px", cursor: "pointer" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f0f2f5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {/* <CirclePlus /> <span style={{ fontWeight: "600" }}>  Interested</span> <br /> */}
                  </div>
                  <span>More of your posts will be like this</span>
                </div>

                <div
                  style={{ padding: "10px", cursor: "pointer" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f0f2f5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {/* <CircleMinus />  <span style={{ fontWeight: "600" }}> Not Interested</span> */}
                  </div>

                  <span>Fewer of your posts will be like this </span>
                </div>
              </div>
            </Dropdown.Header>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown align="end">
          <Dropdown.Toggle
            variant="light"
            id="profile-dropdown"
            // id="dropdown-autoclose-true"
            style={{
              border: "none",
              display: "flex",
              padding: "4px",
              alignItems: "center",
              backgroundColor: "transparent",
            }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                // src={profilePic}
                src={user?.profilePic || defaultPic}
                alt="fb_profile"
                key={profilePic}
                height={40}
                width={40}
                style={{ borderRadius: "50%" }}
              />

              <div
                style={{
                  backgroundColor: "#E2E5E9",
                  padding: "3px",
                  borderRadius: "45px",
                  position: "absolute",
                  left: "24px",
                  top: "25px",
                  border: "2px solid white",
                }}
              >
                <img
                  src={chevron_down}
                  alt="chevron down"
                  style={{ width: "6px", height: "6px" }}
                />
              </div>
            </div>
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ minWidth: "250px" }}>
            <Dropdown.Header>
              <div
                style={{
                  borderRadius: "10px",
                  boxShadow: "0px 3px 3px 1px rgba(148, 148, 148, 0.5)",
                  padding: "12px",
                  marginBottom: "18px",
                }}
              >
                {/* Profile Card */}
                <div
                  className="profileImageName"
                  onClick={() => navigate("/HomePage/facebook/profile")}
                >
                  <img
                    src={user?.profilePic || defaultPic}
                    alt="fb_profile"
                    key={profilePic}
                    height={40}
                    width={40}
                    style={{ borderRadius: "50%" }}

                  />
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "#080809",
                      fontSize: "17px",
                    }}
                  >
                    {user?.username || "unknown"}
                  </span>
                </div>
                <hr />
                <div>
                  <button
                    className="profile-btn"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <span className="fb-sprite-icon"></span>
                    <span className="btn-text">See All Profiles</span>
                  </button>
                </div>
              </div>
              {/* Sub menus */}
              {/* SETTINGS & PRIVACY */}
              <div
                style={{
                  fontWeight: "500",
                  color: "#080809",
                  padding: "8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#edeef0ff";
                  e.currentTarget.style.borderRadius = "10px";
                }}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ffffff")
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    cursor: "pointer",
                    width: "100%",
                  }}
                  onClick={toggleSettings}
                >
                  <div
                    style={{
                      backgroundColor: "#E2E5E9",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src="https://img.icons8.com/?size=100&id=2969&format=png&color=000000"
                      alt="settings"
                      width={20}
                      height={20}
                    />
                  </div>

                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: "15px",
                      fontWeight: "600",
                    }}
                  >
                    Settings & Privacy
                  </span>

                  {/* Arrow icon */}
                  <span
                    style={{
                      marginLeft: "auto",
                      backgroundImage:
                        'url("https://static.xx.fbcdn.net/rsrc.php/v4/yv/r/zY1TekFCJ__.png")',
                      backgroundPosition: "0px -100px",
                      backgroundSize: "auto",
                      width: "24px",
                      height: "24px",
                      display: "inline-block",
                      transform: showSettings
                        ? "rotate(90deg)"
                        : "rotate(0deg)",
                      transition: "0.2s",
                    }}
                  ></span>
                </div>

                {/* SUB ITEMS (VISIBLE ONLY WHEN OPENED) */}
                {showSettings && (
                  <div
                    style={{
                      marginLeft: "60px",
                      marginTop: "10px",
                      maxWidth: "200px",
                    }}
                  >
                    <div
                      onClick={openFilePicker}
                      style={{
                        padding: "8px",
                        cursor: "pointer",
                        backgroundColor: "#ffffffff",
                        borderRadius: "8px",
                        fontSize: "14px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderRadius = "10px";
                      }}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#ffffff")
                      }
                    >
                      Change Profile Picture
                    </div>
                  </div>
                )}
              </div>

              <div
                style={{
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
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ffffff")
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#E2E5E9",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src="https://img.icons8.com/?size=100&id=2908&format=png&color=000000"
                      alt="settings"
                      width={20}
                      height={20}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: "15px",
                      fontWeight: "600",
                    }}
                  >
                    Help & support
                  </span>
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
                      color: "#E2E5E9",
                    }}
                  ></span>
                </div>
              </div>

              <div
                style={{
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
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ffffff")
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#E2E5E9",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src="https://img.icons8.com/?size=100&id=59841&format=png&color=000000"
                      alt="settings"
                      width={20}
                      height={20}
                    />
                  </div>
                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: "15px",
                      fontWeight: "600",
                    }}
                  >
                    Display and accessibility
                  </span>
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
                      color: "#E2E5E9",
                    }}
                  ></span>
                </div>
              </div>

              <div
                style={{
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
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ffffff")
                }
              >
                <div
                  style={{
                    backgroundColor: "#E2E5E9",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      backgroundImage:
                        "url('https://static.xx.fbcdn.net/rsrc.php/v4/y5/r/mVfnqkD1Z7J.png')",
                      backgroundPosition: "0px -67px",
                      backgroundRepeat: "no-repeat",
                      width: "20px",
                      height: "20px",
                      display: "inline-block",
                    }}
                  ></span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#080809",
                    }}
                  >
                    Give Feedback
                  </span>
                  <span
                    style={{
                      marginLeft: "8px",
                      fontSize: 13,
                      color: "#080809",
                      fontWeight: "normal",
                    }}
                  >
                    CTRL B
                  </span>
                </div>
              </div>

              <div
                style={{
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
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#ffffff")
                }
                onMouseDown={(e) => e.preventDefault()}
              >
                <div
                  style={{
                    backgroundColor: "#E2E5E9",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      backgroundImage:
                        "url('https://static.xx.fbcdn.net/rsrc.php/v4/y5/r/mVfnqkD1Z7J.png')",
                      backgroundPosition: "0px -109px",
                      backgroundRepeat: "no-repeat",
                      width: "20px",
                      height: "20px",
                      display: "inline-block",
                    }}
                  ></span>
                </div>
                <span
                  style={{
                    marginLeft: "8px",
                    fontSize: "15px",
                    fontWeight: "600",
                  }}
                >
                  Logout
                </span>
              </div>

              <div style={{ color: "#65686C", fontSize: "13px" }}>
                <span className="end-text">Privacy</span> ·{" "}
                <span className="end-text">Terms</span> ·{" "}
                <span className="end-text">Advertising</span> ·{" "}
                <span className="end-text">Ad Choices</span> ·{" "}
                <span className="end-text">Cookies</span> · <br />
                <span className="end-text">More</span>
              </div>
            </Dropdown.Header>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={onSelectFile}
      />
    </div>
  );
}

export default TopRightIcons;
