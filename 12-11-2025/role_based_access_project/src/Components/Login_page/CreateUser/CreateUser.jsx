// import React, { useState } from "react";
// import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function CreateUser() {
//   const [username, setUserName] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("EMPLOYEE");
//   const [productName, setProductName] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("http://localhost:8082/api/users/register", { 
//         username, 
//         password, 
//         role,
//         product_name: productName 
//       });
//       if (res.status === 200) {
//         alert("User created");
//         navigate("/");
//       }
//     } catch (err) {
//       alert(err?.response?.data || "Error registering");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
//       <div className="p-5 bg-white shadow rounded form-container">
//         <h3 className="text-center mb-4">Create User</h3>
//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3">
//             <Form.Label>Username</Form.Label>
//             <Form.Control value={username} onChange={(e) => setUserName(e.target.value)} required />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Password</Form.Label>
//             <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Role</Form.Label>
//             <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
//               <option value="EMPLOYEE">EMPLOYEE</option>
//               <option value="MANAGER">MANAGER</option>
//               <option value="ADMIN">ADMIN</option>
//             </Form.Select>
//           </Form.Group>

//           {(role === "MANAGER" || role === "EMPLOYEE") && (
//             <Form.Group className="mb-3">
//               <Form.Label>Product/Team</Form.Label>
//               <Form.Select value={productName} onChange={(e) => setProductName(e.target.value)} required>
//                 <option value="">Select Product</option>
//                 <option value="LIMS">LIMS</option>
//                 <option value="SDMS">SDMS</option>
//                 <option value="ELN">ELN</option>
//                 <option value="DMS">DMS</option>
//               </Form.Select>
//             </Form.Group>
//           )}

//           <Button type="submit" className="w-100 mb-3">Sign Up</Button>
//         </Form>
//       </div>
//     </div>
//   );
// }

// export default CreateUser;

// import React, { useState, useEffect } from "react";
// import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function CreateUser() {
//   const [username, setUserName] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("EMPLOYEE");
//   const [productName, setProductName] = useState("");
//   const [usernameExists, setUsernameExists] = useState(false);
//   const navigate = useNavigate();

//   // get logged user
//   const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "{}");

//   // restrict access to only ADMIN
//   useEffect(() => {
//     if (!currentUser || currentUser.role !== "ADMIN") {
//       alert("Access denied. Only ADMIN can create users.");
//       navigate("/HomePage/dashboard");
//     }
//   }, [currentUser, navigate]);

//   // 🔍 Check if username exists while typing
//   const handleUsernameChange = async (e) => {
//     const name = e.target.value;
//     setUserName(name);

//     if (name.trim().length > 2) {
//       try {
//         const res = await axios.get(`http://localhost:8082/api/users/checkUsername/${name}`);
//         setUsernameExists(res.data.exists);
//       } catch (err) {
//         console.error("Error checking username:", err);
//       }
//     } else {
//       setUsernameExists(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (usernameExists) {
//       alert("Username already exists!");
//       return;
//     }

//     try {
//       const res = await axios.post("http://localhost:8082/api/users/register", {
//         username,
//         password,
//         role,
//         product_name: productName,
//       });
//       if (res.status === 200) {
//         alert("User created successfully!");
//         navigate("/HomePage/dashboard");
//       }
//     } catch (err) {
//       alert(err?.response?.data || "Error registering user");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
//       <div className="p-5 bg-white shadow rounded form-container">
//         <h3 className="text-center mb-4">Create User (Admin)</h3>
//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3">
//             <Form.Label>Username</Form.Label>
//             <Form.Control
//               value={username}
//               onChange={handleUsernameChange}
//               required
//               isInvalid={usernameExists}
//             />
//             {usernameExists && (
//               <Form.Control.Feedback type="invalid">
//                 Username already exists
//               </Form.Control.Feedback>
//             )}
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Password</Form.Label>
//             <Form.Control
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Role</Form.Label>
//             <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
//               <option value="EMPLOYEE">EMPLOYEE</option>
//               <option value="MANAGER">MANAGER</option>
//             </Form.Select>
//           </Form.Group>

//           {(role === "MANAGER" || role === "EMPLOYEE") && (
//             <Form.Group className="mb-3">
//               <Form.Label>Product/Team</Form.Label>
//               <Form.Select
//                 value={productName}
//                 onChange={(e) => setProductName(e.target.value)}
//                 required
//               >
//                 <option value="">Select Product</option>
//                 <option value="LIMS">LIMS</option>
//                 <option value="SDMS">SDMS</option>
//                 <option value="ELN">ELN</option>
//                 <option value="DMS">DMS</option>
//               </Form.Select>
//             </Form.Group>
//           )}

//           <Button type="submit" className="w-100 mb-3">
//             Create User
//           </Button>
//         </Form>
//       </div>
//     </div>
//   );
// }

// export default CreateUser;

// import React, { useState, useEffect } from "react";
// import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";
// import axios from "axios";
// import { useNavigate, useLocation } from "react-router-dom";

// function CreateUser() {
//   const [username, setUserName] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("EMPLOYEE");
//   const [productName, setProductName] = useState("");
//   const [usernameExists, setUsernameExists] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "{}");

//   const isAdmin = currentUser?.role === "ADMIN";
//   const usernameFromLogin = location.state?.usernameFromLogin || "";

//   // prefill if came from login
//   useEffect(() => {
//     if (usernameFromLogin) {
//       setUserName(usernameFromLogin);
//     }
//   }, [usernameFromLogin]);

//   const handleUsernameChange = async (e) => {
//     const name = e.target.value;
//     setUserName(name);
//     if (name.trim().length > 2) {
//       try {
//         const res = await axios.get(
//           `http://localhost:8082/api/users/checkUsername/${name}`
//         );
//         setUsernameExists(res.data.exists);
//       } catch (err) {
//         console.error("Error checking username:", err);
//       }
//     } else {
//       setUsernameExists(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (usernameExists) {
//       alert("Username already exists!");
//       return;
//     }

//     try {
//       const res = await axios.post("http://localhost:8082/api/users/register", {
//         username,
//         password,
//         role,
//         product_name: productName,
//       });
//       if (res.status === 200) {
//         alert("User created successfully!");
//         // if came from login, go back to login and fill username
//         if (!isAdmin && usernameFromLogin) {
//           navigate("/", { state: { createdUsername: username } });
//         } else {
//           navigate("/HomePage/dashboard");
//         }
//       }
//     } catch (err) {
//       alert(err?.response?.data || "Error registering user");
//       console.error(err);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
//       <div className="p-5 bg-white shadow rounded form-container" style={{ width: "400px" }}>
//         <h3 className="text-center mb-4">
//           {isAdmin ? "Create User (Admin)" : "Create New Account"}
//         </h3>

//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3">
//             <Form.Label>Username</Form.Label>
//             <Form.Control
//               value={username}
//               onChange={handleUsernameChange}
//               required
//               isInvalid={usernameExists}
//             />
//             {usernameExists && (
//               <Form.Control.Feedback type="invalid">
//                 Username already exists
//               </Form.Control.Feedback>
//             )}
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Password</Form.Label>
//             <Form.Control
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </Form.Group>

//           {(isAdmin || usernameFromLogin) && (
//             <>
//               <Form.Group className="mb-3">
//                 <Form.Label>Role</Form.Label>
//                 <Form.Select
//                   value={role}
//                   onChange={(e) => setRole(e.target.value)}
//                   disabled={!isAdmin}
//                 >
//                   <option value="EMPLOYEE">EMPLOYEE</option>
//                   <option value="MANAGER">MANAGER</option>
//                 </Form.Select>
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Product/Team</Form.Label>
//                 <Form.Select
//                   value={productName}
//                   onChange={(e) => setProductName(e.target.value)}
//                   required
//                 >
//                   <option value="">Select Product</option>
//                   <option value="LIMS">LIMS</option>
//                   <option value="SDMS">SDMS</option>
//                   <option value="ELN">ELN</option>
//                   <option value="DMS">DMS</option>
//                 </Form.Select>
//               </Form.Group>
//             </>
//           )}

//           <Button type="submit" className="w-100">
//             Create User
//           </Button>
//         </Form>
//       </div>
//     </div>
//   );
// }

// export default CreateUser;


import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

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

  // ✅ Check if username already exists
  const handleUsernameChange = async (e) => {
    const name = e.target.value;
    setUserName(name);

    if (name.trim().length > 2) {
      try {
        const res = await axios.get(
          `http://localhost:8082/api/users/checkUsername/${name}`
        );
        setUsernameExists(res.data.exists);
      } catch (err) {
        console.error("Error checking username:", err);
      }
    } else {
      setUsernameExists(false);
    }
  };

    // ✅ Validate password match
    useEffect(() => {
      if (confirmPassword !== "" && password !== confirmPassword) {
        setPasswordMatch(false);
      } else {
        setPasswordMatch(true);
      }
    }, [password, confirmPassword]);

  // ✅ Submit - create user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (usernameExists) {
      alert("Username already exists!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8082/api/users/register", {
        username,
        password,
        role: null, // fixed role
        product_name: null, // no product for self-registration
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
        style={{ width: "400px" }}
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
              isInvalid={usernameExists}
            />
            {usernameExists && (
              <Form.Control.Feedback type="invalid">
                Username already exists
              </Form.Control.Feedback>
            )}
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
              isInvalid={!passwordMatch}
              required
            />
            <Form.Control.Feedback type="invalid">
              Passwords do not match
            </Form.Control.Feedback>
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
