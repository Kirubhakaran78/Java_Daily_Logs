import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import "./Login.css";
import {config} from "../../services/api"

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const prefilledUsername = location.state?.createdUsername || "";
  const [username, setUserName] = useState(prefilledUsername);
  const [password, setPassword] = useState("");
  const [usernameValid, setUsernameValid] = useState(null);
  const [checking, setChecking] = useState(false);

  // check username validity
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (username.trim().length > 2) {
        setChecking(true);
        try {
          const res = await axios.get(
            `http://localhost:${config.BASE_URL}/Org_Management_java/api/users/checkUsername/${username}`
          );
          setUsernameValid(!!res.data.exists);
        } catch (err) {
          console.error("Error checking username:", err);
          setUsernameValid(false);
        } finally {
          setChecking(false);
        }
      } else {
        setUsernameValid(null);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if username invalid → go to CreateUser
    if (usernameValid === false) {
      navigate("/CreateUser", { state: { usernameFromLogin: username } });
      return;
    }

    try {
      const res = await axios.post(`http://localhost:${config.BASE_URL}/Org_Management_java/api/users/login`, {
        username,
        password,
      });

      if (res.status === 200 && res.data) {
        sessionStorage.setItem("currentUser", JSON.stringify(res.data));
        navigate("/HomePage/dashboard");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (err) {
      const msg = err?.response?.data || "Error connecting to server";
      if (msg.includes("access")) {
        alert("You need access — please contact admin.");
      } else {
        alert(msg);
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 login-bg">
      <div
        className="p-5 bg-white rounded shadow form-container"
        style={{
          width: "420px",
          height: "450px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h3 className="text-center mb-4">Login</h3>

        <Form onSubmit={handleSubmit}>
          {/* Username */}
          <Form.Group className="mb-2">
            <Form.Label>Username</Form.Label>
            <Form.Control
              value={username}
              onChange={(e) => setUserName(e.target.value.trim())}
              onKeyDown={(e) => {
                if (e.key === "Enter" && usernameValid === false) {
                  e.preventDefault();
                  navigate("/CreateUser", {
                    state: { usernameFromLogin: username },
                  });
                }
              }}
              placeholder="Enter your username"
              required
              autoComplete="off"
            />

            <div className="validation-message">
              <small
                className={
                  checking
                    ? "text-muted"
                    : usernameValid === false
                    ? "text-danger"
                    : "invisible"
                }
              >
                {checking
                  ? "Checking username..."
                  : "Username not found — Enter to create new account"}
              </small>
            </div>
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="new-password"
            />

            <div className="forgot-password-placeholder">
              {/* {usernameValid && (
                <Link
                  to="/ForgotPassword"
                  className="text-primary"
                  style={{ textDecoration: "underline" }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/ForgotPassword", { state: { username } });
                  }}
                >
                  Forgot Password?
                </Link>
              )} */}
              {usernameValid === true && (
                <Link
                  to="/ForgotPassword"
                  className="text-primary"
                  style={{ textDecoration: "underline" }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/ForgotPassword", { state: { username } });
                  }}
                >
                  Forgot Password?
                </Link>
              )}
            </div>
          </Form.Group>

          <Button type="submit" className="w-100 mb-3" disabled={checking}>
            <span style={{ visibility: checking ? "hidden" : "visible" }}>
              Log In
            </span>
            {checking && (
              <span className="spinner-border spinner-border-sm ms-2"></span>
            )}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Login;
