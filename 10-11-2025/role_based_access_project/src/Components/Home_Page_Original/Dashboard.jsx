import React, { useEffect } from 'react'
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { useState } from 'react';

function Dashboard() {
    // State for all users
    const [users, setUsers] = useState([
        {},
    ]);


    //fetching 
    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8082/api/masters/getAllMasters");
            console.log("Fetched users:", response.data);
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>

            <h2 style={{ position: "absolute", top: "0px", left: "130px" }}>Dashboard</h2>

            <div style={{ marginTop: "80px" }}>
                <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Emp ID</th>
            <th>Emp Name</th>
            <th>Emp Email</th>
            <th>Product Name</th>
            <th>Emp Role</th>
            <th>Site</th>
            <th>Approve</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.emp_id}</td>
              <td>{user.emp_name}</td>
              <td>{user.emp_email}</td>
              <td>{user.product_name}</td>
              <td>{user.emp_role}</td>
              <td>{user.site}</td>
              <td style={{ color: user.approve ? "green" : "red" }}>{user.approve ? 'Active' : 'Unapproved'}</td>
            </tr>
          ))}
        </tbody>
      </Table>


      {/* Product Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Budget Per Annum</th>
            <th>Total Employees</th>
           
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.product_id}</td>
              <td>{user.product_name}</td>
              <td>{user.budget_per_annum}</td>
              <td>{user.total_employees}</td>
             
            </tr>
          ))}
        </tbody>
      </Table>

            </div>
        </div>
    )
}

export default Dashboard
