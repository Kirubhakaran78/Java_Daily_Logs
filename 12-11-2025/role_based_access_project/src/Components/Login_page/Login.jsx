// import { useState } from "react";
// import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./Login.css";

// function Login() {
//   const [username, setUserName] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("http://localhost:8082/api/users/login", { username, password });
//       // success returns user object
//       if (res.status === 200 && res.data) {
//         // store in sessionStorage (simple)
//         sessionStorage.setItem("currentUser", JSON.stringify(res.data));
//         navigate("/HomePage/dashboard");
//       } else {
//         alert("Login failed");
//       }
//     } catch (err) {
//       const msg = err?.response?.data || "Error connecting to server";
//       alert(msg);
//       console.error(err);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center min-vh-100 login-bg">
//       <div className="p-5 bg-white rounded shadow form-container">
//         <h3 className="text-center mb-4">Login</h3>
//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3">
//             <Form.Label>Username</Form.Label>
//             <Form.Control value={username} onChange={(e) => setUserName(e.target.value)} />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Password</Form.Label>
//             <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//               <div className="text-start mt-2">
//                             <Link
//                                 to="/ForgotPassword"
//                                 className="text-primary"
//                                 style={{ textDecoration: "underline" }}
//                             >
//                                 Forgot Password?
//                             </Link>
//                         </div>
//           </Form.Group>

//           <Button type="submit" className="w-100 mb-3">Sign In</Button>
// {/* 
//           <div className="text-center">
//             Don't have an account? <Link to="/CreateUser">Sign up</Link>
//           </div> */}
//         </Form>
//       </div>
//     </div>
//   );
// }

// export default Login;

// import { useState } from "react";
// import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./Login.css";
// // navigate("/ForgotPassword", { state: { username } });


// function Login() {
//   const [username, setUserName] = useState("");
//   const [password, setPassword] = useState("");
//   const [usernameValid, setUsernameValid] = useState(null); // null = unknown, true = valid, false = invalid
//   const navigate = useNavigate();

//   // Function to check username existence in backend
//   const handleUsernameChange = async (e) => {
//     const name = e.target.value.trim();
//     setUserName(name);

//     if (name.length > 2) {
//       try {
//         const res = await axios.get(`http://localhost:8082/api/users/checkUsername/${name}`);
//         setUsernameValid(res.data.exists);
//       } catch (err) {
//         console.error("Error checking username:", err);
//       }
//     } else {
//       setUsernameValid(null);
//     }
//   };

//   // Handle login submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (usernameValid === false) {
//       alert("Invalid username — please enter a valid one.");
//       return;
//     }

//     try {
//       const res = await axios.post("http://localhost:8082/api/users/login", { username, password });
//       if (res.status === 200 && res.data) {
//         sessionStorage.setItem("currentUser", JSON.stringify(res.data));
//         navigate("/HomePage/dashboard");
//       } else {
//         alert("Login failed");
//       }
//     } catch (err) {
//       const msg = err?.response?.data || "Error connecting to server";
//       alert(msg);
//       console.error(err);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center min-vh-100 login-bg">
//       <div className="p-5 bg-white rounded shadow form-container" style={{ width: "400px" }}>
//         <h3 className="text-center mb-4">Login</h3>
//         <Form onSubmit={handleSubmit}>
//           {/* Username field */}
//           <Form.Group className="mb-3">
//             <Form.Label>Username</Form.Label>
//             <Form.Control
//               value={username}
//               onChange={handleUsernameChange}
//               // isInvalid={usernameValid === false}
//               // isValid={usernameValid === true}
//               placeholder="Enter your username"
//               required
//               autoComplete="off"
//             />
//             {usernameValid === false && (
//               <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
//                 <span style={{ background: "#ee402233" }}>Invalid username — user not found</span>
//               </Form.Control.Feedback>
//             )}

//           </Form.Group>

//           {/* Password field */}

//           <Form.Group className="mb-3">
//             <Form.Label>Password</Form.Label>
//             <Form.Control
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               required
//               autoComplete="new-password"
//             />

//             {usernameValid && (
//               <div className="text-start mt-2">
//                 <Link
//                   to="/ForgotPassword"
//                   className="text-primary"
//                   style={{ textDecoration: "underline" }}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     navigate("/ForgotPassword", { state: { username } });
//                   }}
//                 >
//                   Forgot Password?
//                 </Link>
//               </div>
//             )}
//           </Form.Group>



//           {/* Submit */}
//           <Button
//             type="submit"
//             className="w-100 mb-3"
//             disabled={usernameValid === false}
//           >
//             Sign In
//           </Button>
//         </Form>
//       </div>
//     </div>
//   );
// }

// export default Login;

import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const prefilledUsername = location.state?.createdUsername || "";
  const [username, setUserName] = useState(prefilledUsername);
  const [password, setPassword] = useState("");
  const [usernameValid, setUsernameValid] = useState(null);
  const [checking, setChecking] = useState(false);

  // ✅ check username validity
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (username.trim().length > 2) {
        setChecking(true);
        try {
          const res = await axios.get(
            `http://localhost:8082/api/users/checkUsername/${username}`
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

  // ✅ handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // if username invalid → go to CreateUser
    if (usernameValid === false) {
      navigate("/CreateUser", { state: { usernameFromLogin: username } });
      return;
    }

    try {
      const res = await axios.post("http://localhost:8082/api/users/login", {
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
      alert(msg);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 login-bg">
      <div
        className="p-5 bg-white rounded shadow form-container"
        style={{ width: "400px" }}
      >
        <h3 className="text-center mb-4">Login</h3>

        <Form onSubmit={handleSubmit}>
          {/* Username */}
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              value={username}
              onChange={(e) => setUserName(e.target.value.trim())}
              onKeyDown={(e) => {
                if (e.key === "Enter" && usernameValid === false) {
                  e.preventDefault();
                  navigate("/CreateUser", { state: { usernameFromLogin: username } });
                }
              }}
              placeholder="Enter your username"
              required
              autoComplete="off"
            />
            {checking && (
              <Form.Text className="text-muted">Checking username...</Form.Text>
            )}
            {usernameValid === false && !checking && (
              <Form.Text className="text-danger">
                Username not found — Click Sign In to create a new account
              </Form.Text>
            )}
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
            {usernameValid && (
              <div className="text-start mt-2">
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
              </div>
            )}
          </Form.Group>

          <Button
            type="submit"
            className="w-100 mb-3"
            disabled={checking}
          >
            {checking ? "Checking..." : "Sign In"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Login;
