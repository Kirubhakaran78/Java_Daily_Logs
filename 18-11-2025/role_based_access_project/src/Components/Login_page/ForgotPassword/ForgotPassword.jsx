import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get username from login page
  useEffect(() => {
    if (location.state?.username) {
      setUsername(location.state.username);
    } else {
      // No username passed, go back to login
      alert("No username found. Please login again.");
      navigate("/");
    }
  }, [location, navigate]);

  // ✅ Validate password match
  useEffect(() => {
    if (confirmPassword !== "" && newPassword !== confirmPassword) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  }, [newPassword, confirmPassword]);

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordMatch) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.put(
        "http://localhost:9092/Org_Management_java/api/users/updateUser",
        {
          username,
          password: newPassword,
        }
      );

      if (res.status === 200) {
        alert("Password updated successfully!");
        // navigate("/");
        navigate("/", { state: { createdUsername: username } });
      }
    } catch (err) {
      alert(err?.response?.data || "Error updating password");
      console.error(err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="p-5 bg-white shadow rounded form-container"
        style={{
          width: "400px",
          minHeight: "420px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h3 className="text-center mb-4">Reset Password</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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

          <Button
            type="submit"
            className="w-100 mb-3"
            disabled={!passwordMatch}
          >
            Update Password
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

export default ForgotPassword;
