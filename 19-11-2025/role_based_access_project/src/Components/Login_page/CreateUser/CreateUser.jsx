import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {config} from "../../../utils/api"

function CreateUser() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [usernameExists, setUsernameExists] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const usernameFromLogin = location.state?.usernameFromLogin || "";

  // prefill if came from login
  useEffect(() => {
    if (usernameFromLogin) {
      setUserName(usernameFromLogin);
    }
  }, [usernameFromLogin]);

  // Check if username already exists
  const handleUsernameChange = async (e) => {
    const name = e.target.value;
    setUserName(name);

    if (name.trim().length > 2) {
      try {
        const res = await axios.get(
          `http://localhost:${config.BASE_URL}/Org_Management_java/api/users/checkUsername/${name}`
        );
        setUsernameExists(res.data.exists);
      } catch (err) {
        console.error("Error checking username:", err);
      }
    } else {
      setUsernameExists(false);
    }
  };

  // Validate password match
  useEffect(() => {
    if (confirmPassword !== "" && password !== confirmPassword) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  }, [password, confirmPassword]);

  // Submit - create user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (usernameExists) {
      alert("Username already exists!");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:${config.BASE_URL}/Org_Management_java/api/users/register`, {
        username,
        password,
        role: null, // fixed role
        product_name: null, // no product for self-registration
        status: "IN_PROGRESS"
      });

      if (res.status === 200) {
        alert("Account created successfully! You can now log in.");
        navigate("/", { state: { createdUsername: username } });
      }
    } catch (err) {
      alert(err?.response?.data || "Error registering user");
      console.error(err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="p-5 bg-white shadow rounded form-container"
        style={{
          width: "400px",
          minHeight: "500px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h3 className="text-center mb-4">Create Account</h3>

        <Form onSubmit={handleSubmit}>
          {/* Username */}
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              value={username}
              onChange={handleUsernameChange}
              required
            />
            <div style={{ minHeight: "23px", marginTop: "4px" }}>
              {usernameExists && (
                <small className="text-danger">Username already exists</small>
              )}
            </div>
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div style={{ minHeight: "30px", marginTop: "5px" }}>
              {!passwordMatch && confirmPassword && (
                <small className="text-danger">Passwords do not match</small>
              )}
            </div>
          </Form.Group>

          <Button type="submit" className="w-100">
            Create User
          </Button>

          <div className="text-center">
            <Button variant="link" onClick={() => navigate("/")}>
              Back to Login
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default CreateUser;
