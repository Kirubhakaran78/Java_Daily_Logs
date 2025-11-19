// import React, { useState } from "react";
// import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function ForgotPassword() {
//   const [username, setUserName] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) { alert("Passwords do not match"); return; }
//     try {
//       const res = await axios.put("http://localhost:8082/api/users/updateUser", { username, password });
//       if (res.status === 200) {
//         alert("Updated");
//         navigate("/");
//       }
//     } catch (err) {
//       alert(err?.response?.data || "Error");
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
//       <div className="p-5 bg-white shadow rounded form-container">
//         <h3 className="text-center mb-4">Create New Password</h3>
//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3">
//             <Form.Label>Username</Form.Label>
//             <Form.Control value={username} onChange={(e)=>setUserName(e.target.value)} />
//           </Form.Group>
//           <Form.Group className="mb-3">
//             <Form.Label>Password</Form.Label>
//             <Form.Control type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
//           </Form.Group>
//           <Form.Group className="mb-3">
//             <Form.Label>Confirm Password</Form.Label>
//             <Form.Control type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
//           </Form.Group>
//           <Button type="submit" className="w-100">Submit</Button>
//         </Form>
//       </div>
//     </div>
//   );
// }

// export default ForgotPassword;

// import React, { useState } from "react";
// import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function ForgotPassword() {
//   const [username, setUsername] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [usernameValid, setUsernameValid] = useState(null); // null=unknown, true=valid, false=invalid
//   const navigate = useNavigate();

//   // Live check username
//   const handleUsernameChange = async (e) => {
//     const name = e.target.value.trim();
//     setUsername(name);

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

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!usernameValid) {
//       alert("Invalid username — cannot update password.");
//       return;
//     }

//     try {
//       const res = await axios.put("http://localhost:8082/api/users/updateUser", {
//         username,
//         password: newPassword,
//       });

//       if (res.status === 200) {
//         alert("Password updated successfully!");
//         navigate("/");
//       }
//     } catch (err) {
//       alert(err?.response?.data || "Error updating password");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
//       <div className="p-5 bg-white shadow rounded form-container">
//         <h3 className="text-center mb-4">Forgot Password</h3>

//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3">
//             <Form.Label>Username</Form.Label>
//             <Form.Control
//               value={username}
//               onChange={handleUsernameChange}
//               isInvalid={usernameValid === false}
//               isValid={usernameValid === true}
//               required
//             />
//             {usernameValid === false && (
//               <Form.Control.Feedback type="invalid">
//                 Invalid username — user not found
//               </Form.Control.Feedback>
//             )}
//             {usernameValid === true && (
//               <Form.Control.Feedback type="valid">
//                 Username found
//               </Form.Control.Feedback>
//             )}
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>New Password</Form.Label>
//             <Form.Control
//               type="password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               required
//             />
//           </Form.Group>

//           <Button type="submit" className="w-100 mb-3" disabled={!usernameValid}>
//             Update Password
//           </Button>

//           <div className="text-center">
//             <Button variant="link" onClick={() => navigate("/")}>
//               Back to Login
//             </Button>
//           </div>
//         </Form>
//       </div>
//     </div>
//   );
// }

// export default ForgotPassword;


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
      const res = await axios.put("http://localhost:8082/api/users/updateUser", {
        username,
        password: newPassword,
      });

      if (res.status === 200) {
        alert("Password updated successfully!");
        navigate("/");
      }
    } catch (err) {
      alert(err?.response?.data || "Error updating password");
      console.error(err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="p-5 bg-white shadow rounded form-container">
        <h3 className="text-center mb-4">Reset Password</h3>

        <Form onSubmit={handleSubmit}>
          {/* <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              readOnly
              plaintext
              className="fw-bold text-secondary"
            />
          </Form.Group> */}

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
              isInvalid={!passwordMatch}
              required
            />
            <Form.Control.Feedback type="invalid">
              Passwords do not match
            </Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" className="w-100 mb-3" disabled={!passwordMatch}>
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

