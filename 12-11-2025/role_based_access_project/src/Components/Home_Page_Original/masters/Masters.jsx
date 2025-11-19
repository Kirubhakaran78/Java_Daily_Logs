import React, { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import EmployeeTable from "./EmployeeTable";
import ProductTable from "./ProductTable";
import RevenueTable from "./RevenueTable";
import axios from "axios";
import "./Masters.css";

function Masters() {
  const [activeKey, setActiveKey] = useState("employee");
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("currentUser") || "{}")
  );

  useEffect(() => {
    if (currentUser?.username) {
      axios.get(`http://localhost:8082/api/users/currentUser?username=${currentUser.username}`)
        .then(res => {
          sessionStorage.setItem("currentUser", JSON.stringify(res.data));
          setCurrentUser(res.data);
        })
        .catch(err => console.log(err));
    }
  }, [currentUser?.username]);

  const allowedRoles = ["ADMIN", "MANAGER", "EMPLOYEE"];
  if (!allowedRoles.includes(currentUser?.role?.toUpperCase())) {
    return (
      <div className="text-center mt-5">
        <h4>You need access to view this page.</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      <div className="content-card">
        <div className="content-header d-flex align-items-center justify-content-between">
          <div>
            <h1 className="page-title mb-0">Masters</h1>

          </div>
        </div>

        <Nav
          variant="tabs"
          activeKey={activeKey}
          onSelect={(k) => setActiveKey(k)}
          className="mb-3 master-tabs"
        >
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

        <div className="tab-content">
          {activeKey === "employee" && <EmployeeTable />}
          {activeKey === "product" && <ProductTable />}
          {activeKey === "revenue" && <RevenueTable />}
        </div>
      </div>
    </div>
  );
}

export default Masters;
