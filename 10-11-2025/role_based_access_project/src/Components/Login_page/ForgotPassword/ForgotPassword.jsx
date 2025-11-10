import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Nav } from "react-bootstrap";
import CryptoJS from "crypto-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(password != confirmPassword){
      alert("Passwords not matched..!");
      return;
    }

    try {
      const response =await axios.put("http://localhost:8082/api/users/updateUser",
        {
          username,
          password
        },
        {
          headers: { "Content-Type": "application/json" }
        },
      )

      if (response.data === "updated successfully!") {
        alert("updated successfully!");
        navigate("/");
      } else {
        alert(response.data);
      }

    } catch (error) {
      alert("Error connecting to server");
      console.error(error);
    }

  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="p-5 bg-white shadow rounded form-container">
        <h3 className="text-center mb-4">Create New Password</h3>
        <Form onSubmit={handleSubmit}>


          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter User Name"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
               value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>


          <Button type="submit" className="w-100 mb-3">
            Submit
          </Button>

          <div className="text-center">

            <Nav.Link
              href="/"
              className="d-inline text-primary p-0"
              style={{ textDecoration: "underline" }}
            >
              Back to login
            </Nav.Link>
          </div>

        </Form>
      </div>
    </div>
  );
}

export default ForgotPassword
