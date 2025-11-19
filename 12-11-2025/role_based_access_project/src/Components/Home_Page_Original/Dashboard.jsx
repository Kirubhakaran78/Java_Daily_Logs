// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import Nav from "react-bootstrap/Nav";
// // import Table from "react-bootstrap/Table";
// // import { Chart } from "react-google-charts";

// // function formatCurrency(val) {
// //   if (val === null || val === undefined || val === "") return "—";
// //   const n = Number(val);
// //   if (Number.isNaN(n)) return val;
// //   return "₹" + n.toLocaleString();
// // }

// // function safeDate(val) {
// //   if (!val) return "N/A";
// //   try {
// //     const d = new Date(val);
// //     if (isNaN(d)) return val;
// //     return d.toLocaleDateString();
// //   } catch {
// //     return val;
// //   }
// // }

// // export default function Dashboard() {
// //   const [currentUser, setCurrentUser] = useState(
// //     JSON.parse(sessionStorage.getItem("currentUser") || "{}")
// //   );
// //   const [activeKey, setActiveKey] = useState("employee"); // default tab

// //   // employees
// //   const [employees, setEmployees] = useState([]);
// //   const [empLoading, setEmpLoading] = useState(true);
// //   const [empError, setEmpError] = useState(null);

// //   // products
// //   const [products, setProducts] = useState([]);
// //   const [prodLoading, setProdLoading] = useState(true);
// //   const [prodError, setProdError] = useState(null);

// //   // revenues
// //   const [revenues, setRevenues] = useState([]);
// //   const [revLoading, setRevLoading] = useState(true);
// //   const [revError, setRevError] = useState(null);

// //   // Fetch data
// //   useEffect(() => {
// //     const fetchEmployees = async () => {
// //       try {
// //         const res = await axios.get("http://localhost:8082/api/masters/getAllEmp");
// //         setEmployees(Array.isArray(res.data) ? res.data : []);
// //       } catch {
// //         setEmpError("Unable to load employees");
// //       } finally {
// //         setEmpLoading(false);
// //       }
// //     };

// //     const fetchProducts = async () => {
// //       try {
// //         const res = await axios.get("http://localhost:8082/api/masters/getAllProduct");
// //         setProducts(Array.isArray(res.data) ? res.data : []);
// //       } catch {
// //         setProdError("Unable to load products");
// //       } finally {
// //         setProdLoading(false);
// //       }
// //     };

// //     const fetchRevenues = async () => {
// //       try {
// //         const res = await axios.get("http://localhost:8082/api/masters/getAllRevenue");
// //         setRevenues(Array.isArray(res.data) ? res.data : []);
// //       } catch {
// //         setRevError("Unable to load revenues");
// //       } finally {
// //         setRevLoading(false);
// //       }
// //     };

// //     fetchEmployees();
// //     fetchProducts();
// //     fetchRevenues();
// //   }, []);

// //   // Refresh current user from session (in case updated)
// //   useEffect(() => {
// //     const storedUser = JSON.parse(sessionStorage.getItem("currentUser") || "{}");
// //     if (storedUser?.username) {
// //       axios
// //         .get(`http://localhost:8082/api/users/currentUser?username=${storedUser.username}`)
// //         .then((res) => {
// //           sessionStorage.setItem("currentUser", JSON.stringify(res.data));
// //           setCurrentUser(res.data);
// //         })
// //         .catch((err) => console.log(err));
// //     }
// //   }, []);

// //   // Role-based filters
// //   const filteredEmployees = employees.filter((emp) => {
// //     if (currentUser.role?.toUpperCase() === "ADMIN") return true;
// //     if (currentUser.role?.toUpperCase() === "MANAGER")
// //       return emp.product_name?.toLowerCase() === currentUser.product_name?.toLowerCase();
// //     if (currentUser.role?.toUpperCase() === "EMPLOYEE")
// //       return emp.emp_id === currentUser.emp_id;
// //     return false;
// //   });

// //   const filteredProducts = products.filter((prod) => {
// //     if (currentUser.role?.toUpperCase() === "ADMIN") return true;
// //     if (currentUser.role?.toUpperCase() === "MANAGER")
// //       return prod.product_name?.toLowerCase() === currentUser.product_name?.toLowerCase();
// //     if (currentUser.role?.toUpperCase() === "EMPLOYEE")
// //       return prod.product_name?.toLowerCase() === currentUser.product_name?.toLowerCase();
// //     return false;
// //   });

// //   const filteredRevenues = revenues.filter((rev) => {
// //     if (currentUser.role?.toUpperCase() === "ADMIN") return true;
// //     if (currentUser.role?.toUpperCase() === "MANAGER")
// //       return rev.product_name?.toLowerCase() === currentUser.product_name?.toLowerCase();
// //     if (currentUser.role?.toUpperCase() === "EMPLOYEE")
// //       return rev.product_name?.toLowerCase() === currentUser.product_name?.toLowerCase();
// //     return false;
// //   });

// //   // Pie chart data
// //   const getPieChartData = () => {
// //     if (filteredRevenues.length === 0) return [["Product", "Profit"]];
// //     const chartData = [["Product", "Profit"]];
// //     const productProfits = {};

// //     filteredRevenues.forEach((rev) => {
// //       const product = rev.product_name || "Unknown";
// //       const profit = parseFloat(rev.profit) || 0;
// //       productProfits[product] = (productProfits[product] || 0) + profit;
// //     });

// //     Object.entries(productProfits).forEach(([product, profit]) => {
// //       chartData.push([product, profit]);
// //     });

// //     return chartData;
// //   };

// //   const chartOptions = {
// //     title: "Profit by Product",
// //     pieHole: 0.4,
// //     colors: ["#1A73E8", "#34A853", "#FBBC04", "#EA4335"],
// //     chartArea: { width: "80%", height: "80%" },
// //     legend: { position: "right", textStyle: { color: "#333", fontSize: 14 } },
// //   };

// //   // Only allow roles we recognize
// //   const allowedRoles = ["ADMIN", "MANAGER", "EMPLOYEE"];
// //   if (!allowedRoles.includes(currentUser?.role?.toUpperCase())) {
// //     return (
// //       <div className="text-center mt-5">
// //         <h4>You need access to view this page.</h4>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div>
// //       <h2 className="mb-4">Dashboard</h2>

// //       {/* Nav Tabs */}
// //       <Nav
// //         fill
// //         variant="tabs"
// //         activeKey={activeKey}
// //         onSelect={(selectedKey) => setActiveKey(selectedKey)}
// //         className="mb-4"
// //       >
// //         <Nav.Item>
// //           <Nav.Link eventKey="employee">Employees</Nav.Link>
// //         </Nav.Item>
// //         <Nav.Item>
// //           <Nav.Link eventKey="product">Products</Nav.Link>
// //         </Nav.Item>
// //         <Nav.Item>
// //           <Nav.Link eventKey="revenue">Revenues</Nav.Link>
// //         </Nav.Item>
// //       </Nav>

// //       {/* Render content based on active tab */}
// //       <div>
// //         {activeKey === "employee" && (
// //           <section>
// //             <h4>Employees</h4>
// //             {empLoading ? (
// //               <div>Loading employees…</div>
// //             ) : empError ? (
// //               <div style={{ color: "red" }}>{empError}</div>
// //             ) : (
// //               <Table striped bordered hover responsive>
// //                 <thead>
// //                   <tr>
// //                     <th>ID</th>
// //                     <th>Emp ID</th>
// //                     <th>Name</th>
// //                     <th>Email</th>
// //                     <th>Product</th>
// //                     <th>Role</th>
// //                     <th>Site</th>
// //                     <th>Date of Joining</th>
// //                     <th>Status</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {filteredEmployees.length === 0 ? (
// //                     <tr>
// //                       <td colSpan={9} className="text-center">
// //                         No employees found.
// //                       </td>
// //                     </tr>
// //                   ) : (
// //                     filteredEmployees.map((e) => (
// //                       <tr key={e.id ?? `${e.emp_id}-${Math.random()}`}>
// //                         <td>{e.id ?? "—"}</td>
// //                         <td>{e.emp_id ?? "—"}</td>
// //                         <td>{e.emp_name ?? "—"}</td>
// //                         <td>{e.emp_email ?? "—"}</td>
// //                         <td>{e.product_name ?? "—"}</td>
// //                         <td>{e.emp_role ?? "—"}</td>
// //                         <td>{e.site ?? "—"}</td>
// //                         <td>{safeDate(e.date_of_joining)}</td>
// //                         <td style={{ color: e.is_active ? "green" : "red" }}>
// //                           {e.is_active ? "Active" : "Inactive"}
// //                         </td>
// //                       </tr>
// //                     ))
// //                   )}
// //                 </tbody>
// //               </Table>
// //             )}
// //           </section>
// //         )}

// //         {activeKey === "product" && (
// //           <section>
// //             <h4>Products</h4>
// //             {prodLoading ? (
// //               <div>Loading products…</div>
// //             ) : prodError ? (
// //               <div style={{ color: "red" }}>{prodError}</div>
// //             ) : (
// //               <Table striped bordered hover responsive>
// //                 <thead>
// //                   <tr>
// //                     <th>ID</th>
// //                     <th>Product ID</th>
// //                     <th>Name</th>
// //                     <th>Budget Per Annum</th>
// //                     <th>Total Employees</th>
// //                     <th>Team Lead</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {filteredProducts.length === 0 ? (
// //                     <tr>
// //                       <td colSpan={6} className="text-center">
// //                         No products found.
// //                       </td>
// //                     </tr>
// //                   ) : (
// //                     filteredProducts.map((p) => (
// //                       <tr key={p.id ?? `${p.product_id}-${Math.random()}`}>
// //                         <td>{p.id ?? "—"}</td>
// //                         <td>{p.product_id ?? "—"}</td>
// //                         <td>{p.product_name ?? "—"}</td>
// //                         <td>{formatCurrency(p.budget_per_annum)}</td>
// //                         <td>{p.total_employees ?? 0}</td>
// //                         <td>{p.team_lead_name ?? "—"}</td>
// //                       </tr>
// //                     ))
// //                   )}
// //                 </tbody>
// //               </Table>
// //             )}
// //           </section>
// //         )}

// //         {activeKey === "revenue" && (
// //           <section>
// //             <h4>Revenues</h4>
// //             {revLoading ? (
// //               <div>Loading revenues…</div>
// //             ) : revError ? (
// //               <div style={{ color: "red" }}>{revError}</div>
// //             ) : (
// //               <>
// //                 <Table striped bordered hover responsive>
// //                   <thead>
// //                     <tr>
// //                       <th>ID</th>
// //                       <th>Revenue ID</th>
// //                       <th>Product</th>
// //                       <th>Month-Year</th>
// //                       <th>Revenue</th>
// //                       <th>Expense</th>
// //                       <th>Profit</th>
// //                       <th>Client</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {filteredRevenues.length === 0 ? (
// //                       <tr>
// //                         <td colSpan={8} className="text-center">
// //                           No revenues found.
// //                         </td>
// //                       </tr>
// //                     ) : (
// //                       filteredRevenues.map((r) => (
// //                         <tr key={r.id ?? `${r.revenue_id}-${Math.random()}`}>
// //                           <td>{r.id ?? "—"}</td>
// //                           <td>{r.revenue_id ?? "—"}</td>
// //                           <td>{r.product_name ?? "—"}</td>
// //                           <td>{r.month_year ?? "—"}</td>
// //                           <td>{formatCurrency(r.revenue_amount)}</td>
// //                           <td>{formatCurrency(r.expense_amount)}</td>
// //                           <td
// //                             style={{
// //                               color: Number(r.profit) >= 0 ? "green" : "red",
// //                               fontWeight: 600,
// //                             }}
// //                           >
// //                             {formatCurrency(r.profit)}
// //                           </td>
// //                           <td>{r.client_name ?? "—"}</td>
// //                         </tr>
// //                       ))
// //                     )}
// //                   </tbody>
// //                 </Table>

// //                 {filteredRevenues.length > 0 && (
// //                   <div className="mt-4">
// //                     <h5 className="text-center mb-3">Revenue Profit Distribution</h5>
// //                     <Chart
// //                       chartType="PieChart"
// //                       data={getPieChartData()}
// //                       options={chartOptions}
// //                       width={"100%"}
// //                       height={"400px"}
// //                     />
// //                   </div>
// //                 )}
// //               </>
// //             )}
// //           </section>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Nav from "react-bootstrap/Nav";
// import Table from "react-bootstrap/Table";
// import { Chart } from "react-google-charts";

// function formatCurrency(val) {
//   if (val === null || val === undefined || val === "") return "—";
//   const n = Number(val);
//   if (Number.isNaN(n)) return val;
//   return "₹" + n.toLocaleString();
// }

// function safeDate(val) {
//   if (!val) return "N/A";
//   try {
//     const d = new Date(val);
//     if (isNaN(d)) return val;
//     return d.toLocaleDateString();
//   } catch {
//     return val;
//   }
// }

// export default function Dashboard() {
//   const [currentUser, setCurrentUser] = useState(
//     JSON.parse(sessionStorage.getItem("currentUser") || "{}")
//   );

//   const [activeKey, setActiveKey] = useState("employee");

//   // Employees
//   const [employees, setEmployees] = useState([]);
//   const [empLoading, setEmpLoading] = useState(true);
//   const [empError, setEmpError] = useState(null);

//   // Products
//   const [products, setProducts] = useState([]);
//   const [prodLoading, setProdLoading] = useState(true);
//   const [prodError, setProdError] = useState(null);

//   // Revenues
//   const [revenues, setRevenues] = useState([]);
//   const [revLoading, setRevLoading] = useState(true);
//   const [revError, setRevError] = useState(null);

//   // Fetch data
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const res = await axios.get("http://localhost:8082/api/masters/getAllEmp");
//         setEmployees(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         setEmpError("Unable to load employees");
//       } finally {
//         setEmpLoading(false);
//       }
//     };

//     const fetchProducts = async () => {
//       try {
//         const res = await axios.get("http://localhost:8082/api/masters/getAllProduct");
//         setProducts(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         setProdError("Unable to load products");
//       } finally {
//         setProdLoading(false);
//       }
//     };

//     const fetchRevenues = async () => {
//       try {
//         const res = await axios.get("http://localhost:8082/api/masters/getAllRevenue");
//         setRevenues(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         setRevError("Unable to load revenues");
//       } finally {
//         setRevLoading(false);
//       }
//     };

//     fetchEmployees();
//     fetchProducts();
//     fetchRevenues();
//   }, []);

//   // Refresh current user from backend (optional)
//   useEffect(() => {
//     const storedUser = JSON.parse(sessionStorage.getItem("currentUser") || "{}");
//     if (storedUser?.username) {
//       axios
//         .get(`http://localhost:8082/api/users/currentUser?username=${storedUser.username}`)
//         .then((res) => {
//           sessionStorage.setItem("currentUser", JSON.stringify(res.data));
//           setCurrentUser(res.data);
//         })
//         .catch((err) => console.log(err));
//     }
//   }, []);

//   // Role-based filtered data
//   // const filteredEmployees = employees.filter((emp) => {
//   //   if (!currentUser || !currentUser.role) return false;
//   //   const role = currentUser.role.toUpperCase();
//   //   if (role === "ADMIN") return true;
//   //   if (role === "MANAGER")
//   //     return emp.product_name?.trim().toLowerCase() === currentUser.product_name?.trim().toLowerCase();
//   //   if (role === "EMPLOYEE") return emp.emp_id === currentUser.emp_id;
//   //   return false;
//   // });


// //   const filteredEmployees = employees.filter((emp) => {
// //   if (!currentUser || !currentUser.role) return false;

// //   const role = currentUser.role.toUpperCase();

// //   if (role === "ADMIN") return true;

// //   if (role === "MANAGER") {
// //     return (
// //       emp.product_name?.trim().toLowerCase() ===
// //       currentUser.product_name?.trim().toLowerCase()
// //     );
// //   }

// //   if (role === "EMPLOYEE") {
// //     return String(emp.emp_id)?.trim() === String(currentUser.emp_id)?.trim();
// //   }

// //   return false;
// // });


// const filteredEmployees = employees.filter((emp) => {
//   if (!currentUser || !currentUser.role || !currentUser.emp_id) return false;

//   const role = currentUser.role.toUpperCase();

//   if (role === "ADMIN") return true;

//   if (role === "MANAGER") {
//     return (
//       emp.product_name?.trim().toLowerCase() ===
//       currentUser.product_name?.trim().toLowerCase()
//     );
//   }

//   if (role === "EMPLOYEE") {
//     return String(emp.emp_id).trim() === String(currentUser.emp_id).trim();
//   }

//   return false;
// });



//   const filteredProducts = products.filter((prod) => {
//     if (!currentUser || !currentUser.role) return false;
//     const role = currentUser.role.toUpperCase();
//     if (role === "ADMIN") return true;
//     if (role === "MANAGER" || role === "EMPLOYEE")
//       return prod.product_name?.trim().toLowerCase() === currentUser.product_name?.trim().toLowerCase();
//     return false;
//   });

//   const filteredRevenues = revenues.filter((rev) => {
//     if (!currentUser || !currentUser.role) return false;
//     const role = currentUser.role.toUpperCase();
//     if (role === "ADMIN") return true;
//     if (role === "MANAGER" || role === "EMPLOYEE")
//       return rev.product_name?.trim().toLowerCase() === currentUser.product_name?.trim().toLowerCase();
//     return false;
//   });

//   // Pie chart data
//   const getPieChartData = () => {
//     if (filteredRevenues.length === 0) return [["Product", "Profit"]];

//     const chartData = [["Product", "Profit"]];
//     const productProfits = {};

//     filteredRevenues.forEach((rev) => {
//       const product = rev.product_name || "Unknown";
//       const profit = parseFloat(rev.profit) || 0;
//       productProfits[product] = (productProfits[product] || 0) + profit;
//     });

//     Object.entries(productProfits).forEach(([product, profit]) => {
//       chartData.push([product, profit]);
//     });

//     return chartData;
//   };

//   const chartOptions = {
//     title: "Profit by Product",
//     pieHole: 0.4,
//     colors: ["#1A73E8", "#34A853", "#FBBC04", "#EA4335"],
//     chartArea: { width: "80%", height: "80%" },
//     legend: { position: "right", textStyle: { color: "#333", fontSize: 14 } },
//   };

//   // Access control
//   const allowedRoles = ["ADMIN", "MANAGER", "EMPLOYEE"];
//   if (!allowedRoles.includes(currentUser?.role?.toUpperCase())) {
//     return (
//       <div className="text-center mt-5">
//         <h4>You need access to view this page.</h4>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h2 className="mb-4">Dashboard</h2>

//       <Nav fill variant="tabs" activeKey={activeKey} onSelect={(key) => setActiveKey(key)} className="mb-4">
//         <Nav.Item>
//           <Nav.Link eventKey="employee">Employees</Nav.Link>
//         </Nav.Item>
//         <Nav.Item>
//           <Nav.Link eventKey="product">Products</Nav.Link>
//         </Nav.Item>
//         <Nav.Item>
//           <Nav.Link eventKey="revenue">Revenues</Nav.Link>
//         </Nav.Item>
//       </Nav>

//       <div>
//         {/* Employees Table */}
//         {activeKey === "employee" && (
//           <section>
//             <h4>Employees</h4>
//             {empLoading ? (
//               <div>Loading employees…</div>
//             ) : empError ? (
//               <div style={{ color: "red" }}>{empError}</div>
//             ) : (
//               <Table striped bordered hover responsive>
//                 <thead>
//                   <tr>
//                     <th>ID</th>
//                     <th>Emp ID</th>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Product</th>
//                     <th>Role</th>
//                     <th>Site</th>
//                     <th>Date of Joining</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredEmployees.length === 0 ? (
//                     <tr>
//                       <td colSpan={9} className="text-center">
//                         No employees found.
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredEmployees.map((e) => (
//                       <tr key={e.id ?? `${e.emp_id}-${Math.random()}`}>
//                         <td>{e.id ?? "—"}</td>
//                         <td>{e.emp_id ?? "—"}</td>
//                         <td>{e.emp_name ?? "—"}</td>
//                         <td>{e.emp_email ?? "—"}</td>
//                         <td>{e.product_name ?? "—"}</td>
//                         <td>{e.emp_role ?? "—"}</td>
//                         <td>{e.site ?? "—"}</td>
//                         <td>{safeDate(e.date_of_joining)}</td>
//                         <td style={{ color: e.is_active ? "green" : "red" }}>
//                           {e.is_active ? "Active" : "Inactive"}
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </Table>
//             )}
//           </section>
//         )}

//         {/* Products Table */}
//         {activeKey === "product" && (
//           <section>
//             <h4>Products</h4>
//             {prodLoading ? (
//               <div>Loading products…</div>
//             ) : prodError ? (
//               <div style={{ color: "red" }}>{prodError}</div>
//             ) : (
//               <Table striped bordered hover responsive>
//                 <thead>
//                   <tr>
//                     <th>ID</th>
//                     <th>Product ID</th>
//                     <th>Name</th>
//                     <th>Budget Per Annum</th>
//                     <th>Total Employees</th>
//                     <th>Team Lead</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredProducts.length === 0 ? (
//                     <tr>
//                       <td colSpan={6} className="text-center">
//                         No products found.
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredProducts.map((p) => (
//                       <tr key={p.id ?? `${p.product_id}-${Math.random()}`}>
//                         <td>{p.id ?? "—"}</td>
//                         <td>{p.product_id ?? "—"}</td>
//                         <td>{p.product_name ?? "—"}</td>
//                         <td>{formatCurrency(p.budget_per_annum)}</td>
//                         <td>{p.total_employees ?? 0}</td>
//                         <td>{p.team_lead_name ?? "—"}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </Table>
//             )}
//           </section>
//         )}

//         {/* Revenues Table */}
//         {activeKey === "revenue" && (
//           <section>
//             <h4>Revenues</h4>
//             {revLoading ? (
//               <div>Loading revenues…</div>
//             ) : revError ? (
//               <div style={{ color: "red" }}>{revError}</div>
//             ) : (
//               <>
//                 <Table striped bordered hover responsive>
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>Revenue ID</th>
//                       <th>Product</th>
//                       <th>Month-Year</th>
//                       <th>Revenue</th>
//                       <th>Expense</th>
//                       <th>Profit</th>
//                       <th>Client</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredRevenues.length === 0 ? (
//                       <tr>
//                         <td colSpan={8} className="text-center">
//                           No revenues found.
//                         </td>
//                       </tr>
//                     ) : (
//                       filteredRevenues.map((r) => (
//                         <tr key={r.id ?? `${r.revenue_id}-${Math.random()}`}>
//                           <td>{r.id ?? "—"}</td>
//                           <td>{r.revenue_id ?? "—"}</td>
//                           <td>{r.product_name ?? "—"}</td>
//                           <td>{r.month_year ?? "—"}</td>
//                           <td>{formatCurrency(r.revenue_amount)}</td>
//                           <td>{formatCurrency(r.expense_amount)}</td>
//                           <td
//                             style={{
//                               color: Number(r.profit) >= 0 ? "green" : "red",
//                               fontWeight: 600,
//                             }}
//                           >
//                             {formatCurrency(r.profit)}
//                           </td>
//                           <td>{r.client_name ?? "—"}</td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </Table>

//                 {filteredRevenues.length > 0 && (
//                   <div className="mt-4">
//                     <h5 className="text-center mb-3">Revenue Profit Distribution</h5>
//                     <Chart
//                       chartType="PieChart"
//                       data={getPieChartData()}
//                       options={chartOptions}
//                       width={"100%"}
//                       height={"400px"}
//                     />
//                   </div>
//                 )}
//               </>
//             )}
//           </section>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import Table from "react-bootstrap/Table";
import { Chart } from "react-google-charts";

// Format numbers as currency
function formatCurrency(val) {
  if (val === null || val === undefined || val === "") return "—";
  const n = Number(val);
  if (Number.isNaN(n)) return val;
  return "₹" + n.toLocaleString();
}

// Convert string date to local date safely
function safeDate(val) {
  if (!val) return "N/A";
  try {
    const d = new Date(val);
    if (isNaN(d)) return val;
    return d.toLocaleDateString();
  } catch {
    return val;
  }
}

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("currentUser") || "{}")
  );

  const [activeKey, setActiveKey] = useState("employee");

  // Employees
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(true);
  const [empError, setEmpError] = useState(null);

  // Products
  const [products, setProducts] = useState([]);
  const [prodLoading, setProdLoading] = useState(true);
  const [prodError, setProdError] = useState(null);

  // Revenues
  const [revenues, setRevenues] = useState([]);
  const [revLoading, setRevLoading] = useState(true);
  const [revError, setRevError] = useState(null);

  // Fetch all data
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:8082/api/masters/getAllEmp");
        setEmployees(Array.isArray(res.data) ? res.data : []);
      } catch {
        setEmpError("Unable to load employees");
      } finally {
        setEmpLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8082/api/masters/getAllProduct");
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch {
        setProdError("Unable to load products");
      } finally {
        setProdLoading(false);
      }
    };

    const fetchRevenues = async () => {
      try {
        const res = await axios.get("http://localhost:8082/api/masters/getAllRevenue");
        setRevenues(Array.isArray(res.data) ? res.data : []);
      } catch {
        setRevError("Unable to load revenues");
      } finally {
        setRevLoading(false);
      }
    };

    fetchEmployees();
    fetchProducts();
    fetchRevenues();
  }, []);

  // Refresh current user from backend
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("currentUser") || "{}");
    if (storedUser?.username) {
      axios
        .get(`http://localhost:8082/api/users/currentUser?username=${storedUser.username}`)
        .then((res) => {
          sessionStorage.setItem("currentUser", JSON.stringify(res.data));
          setCurrentUser(res.data);
        })
        .catch(console.log);
    }
  }, []);

  // Role-based filtering
  const filteredEmployees = employees.filter((emp) => {
      if (!currentUser?.role) return false;
      const role = currentUser.role.toUpperCase();
      if (role === "ADMIN") return true;
      if (role === "MANAGER" || role === "EMPLOYEE") {
      return emp.product_name?.trim().toLowerCase() === currentUser.product_name?.trim().toLowerCase();
    }
      return false;
    });

  const filteredProducts = products.filter((prod) => {
    if (!currentUser?.role) return false;
    const role = currentUser.role.toUpperCase();
    if (role === "ADMIN") return true;
    if (role === "MANAGER" || role === "EMPLOYEE") {
      return prod.product_name?.trim().toLowerCase() === currentUser.product_name?.trim().toLowerCase();
    }
    return false;
  });

  const filteredRevenues = revenues.filter((rev) => {
    if (!currentUser?.role) return false;
    const role = currentUser.role.toUpperCase();
    if (role === "ADMIN") return true;
    if (role === "MANAGER" || role === "EMPLOYEE") {
      return rev.product_name?.trim().toLowerCase() === currentUser.product_name?.trim().toLowerCase();
    }
    return false;
  });

  // Pie chart data
  const getPieChartData = () => {
    const chartData = [["Product", "Profit"]];
    const productProfits = {};

    filteredRevenues.forEach((rev) => {
      const product = rev.product_name || "Unknown";
      const profit = parseFloat(rev.profit) || 0;
      productProfits[product] = (productProfits[product] || 0) + profit;
    });

    Object.entries(productProfits).forEach(([product, profit]) => {
      chartData.push([product, profit]);
    });

    return chartData;
  };

  const chartOptions = {
    title: "Profit by Product",
    pieHole: 0.4,
    colors: ["#1A73E8", "#34A853", "#FBBC04", "#EA4335"],
    chartArea: { width: "80%", height: "80%" },
    legend: { position: "right", textStyle: { color: "#333", fontSize: 14 } },
  };

  // Access control
  const allowedRoles = ["ADMIN", "MANAGER", "EMPLOYEE"];
  if (!allowedRoles.includes(currentUser?.role?.toUpperCase())) {
    return (
      <div className="text-center mt-5">
        <h4>You need access to view this page.</h4>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>

      {/* Tabs */}
      <Nav  variant="tabs" activeKey={activeKey} onSelect={setActiveKey} className="mb-4">
        <Nav.Item>
          <Nav.Link eventKey="employee">Employees</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="product">Products</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="revenue">Revenues</Nav.Link>
        </Nav.Item>
      </Nav>

      <div>
        {/* Employees Table */}
        {activeKey === "employee" && (
          <section>
            <h4>Employees</h4>
            {empLoading ? <div>Loading employees…</div> :
            empError ? <div style={{ color: "red" }}>{empError}</div> :
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Emp ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Product</th>
                  <th>Role</th>
                  <th>Site</th>
                  <th>Date of Joining</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr><td colSpan={9} className="text-center">No employees found.</td></tr>
                ) : filteredEmployees.map((e) => (
                  <tr key={e.id ?? `${e.emp_id}-${Math.random()}`}>
                    <td>{e.id ?? "—"}</td>
                    <td>{e.emp_id ?? "—"}</td>
                    <td>{e.emp_name ?? "—"}</td>
                    <td>{e.emp_email ?? "—"}</td>
                    <td>{e.product_name ?? "—"}</td>
                    <td>{e.emp_role ?? "—"}</td>
                    <td>{e.site ?? "—"}</td>
                    <td>{safeDate(e.date_of_joining)}</td>
                    <td style={{ color: e.is_active ? "green" : "red" }}>
                      {e.is_active ? "Active" : "Inactive"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>}
          </section>
        )}

        {/* Products Table */}
        {activeKey === "product" && (
          <section>
            <h4>Products</h4>
            {prodLoading ? <div>Loading products…</div> :
            prodError ? <div style={{ color: "red" }}>{prodError}</div> :
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product ID</th>
                  <th>Name</th>
                  <th>Budget Per Annum</th>
                  <th>Total Employees</th>
                  <th>Team Lead</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr><td colSpan={6} className="text-center">No products found.</td></tr>
                ) : filteredProducts.map((p) => (
                  <tr key={p.id ?? `${p.product_id}-${Math.random()}`}>
                    <td>{p.id ?? "—"}</td>
                    <td>{p.product_id ?? "—"}</td>
                    <td>{p.product_name ?? "—"}</td>
                    <td>{formatCurrency(p.budget_per_annum)}</td>
                    <td>{p.total_employees ?? 0}</td>
                    <td>{p.team_lead_name ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>}
          </section>
        )}

        {/* Revenues Table */}
        {activeKey === "revenue" && (
          <section>
            <h4>Revenues</h4>
            {revLoading ? <div>Loading revenues…</div> :
            revError ? <div style={{ color: "red" }}>{revError}</div> :
            <>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Revenue ID</th>
                    <th>Product</th>
                    <th>Month-Year</th>
                    <th>Revenue</th>
                    <th>Expense</th>
                    <th>Profit</th>
                    <th>Client</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRevenues.length === 0 ? (
                    <tr><td colSpan={8} className="text-center">No revenues found.</td></tr>
                  ) : filteredRevenues.map((r) => (
                    <tr key={r.id ?? `${r.revenue_id}-${Math.random()}`}>
                      <td>{r.id ?? "—"}</td>
                      <td>{r.revenue_id ?? "—"}</td>
                      <td>{r.product_name ?? "—"}</td>
                      <td>{r.month_year ?? "—"}</td>
                      <td>{formatCurrency(r.revenue_amount)}</td>
                      <td>{formatCurrency(r.expense_amount)}</td>
                      <td style={{ color: Number(r.profit) >= 0 ? "green" : "red", fontWeight: 600 }}>
                        {formatCurrency(r.profit)}
                      </td>
                      <td>{r.client_name ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {filteredRevenues.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-center mb-3">Revenue Profit Distribution</h5>
                  <Chart
                    chartType="PieChart"
                    data={getPieChartData()}
                    options={chartOptions}
                    width={"100%"}
                    height={"400px"}
                  />
                </div>
              )}
            </>}
          </section>
        )}
      </div>
    </div>
  );
}

