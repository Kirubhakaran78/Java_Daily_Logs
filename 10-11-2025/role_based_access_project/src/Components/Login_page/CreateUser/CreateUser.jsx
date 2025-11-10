import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Nav } from "react-bootstrap";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import "./CreateUser.css";
import axios from "axios";

function CreateUser() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();


    try {
      const response = axios.post("http://localhost:8082/api/users/saveUser",
         {
                    username,
                    password
                },
                {
                    headers:{
                        "Content-Type":"application/json"
                    }
                }
      )

      if (response.data === "Login successful!") {
        alert("Login successful!");
        navigate("/HomePage");
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
        <h3 className="text-center mb-4">Create User</h3>
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

          <Button type="submit" className="w-100 mb-3">
            Sign Up
          </Button>

          <div className="text-center">
            Already have an account?{" "}
            <Nav.Link
              href="/"
              className="d-inline text-primary p-0"
              style={{ textDecoration: "underline" }}
            >
              Sign in
            </Nav.Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default CreateUser;
