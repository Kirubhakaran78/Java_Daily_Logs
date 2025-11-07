import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Nav } from "react-bootstrap";
import CryptoJS from "crypto-js";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import axios from "axios";

function Login() {

    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();


        try {
            const response =await axios.post("http://localhost:8082/api/users/saveUser",
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

             console.log("Response data:", response.data);

            if (response.data === "Login successful!") {
                navigate("/HomePage");
                 alert("Login successful!");
            } else {
                alert(response.data);
            }

        } catch (error) {
            alert("Error connecting to server");
            console.error(error);
        }

    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 login-bg">
            <div className="p-5 bg-white rounded shadow form-container">
                <h3 className="text-center mb-4">Login</h3>
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
                        <div className="text-start mt-2">
                            <Link
                                to="/ForgotPassword"
                                className="text-primary"
                                style={{ textDecoration: "underline" }}
                            >
                                Forgot Password?
                            </Link>
                        </div>
                    </Form.Group>

                    <Button type="submit" className="w-100 mb-3">
                        Sign In
                    </Button>

                    <div className="text-center">
                        Don't have an account?{" "}
                        <Link
                            to="/Createuser"
                            className="text-primary"
                            style={{ textDecoration: "underline" }}
                        >
                            Sign up
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default Login;
