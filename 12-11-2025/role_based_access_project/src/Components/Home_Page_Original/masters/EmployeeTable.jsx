import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { getUserFromSession, isAdmin, isManager, isEmployee, getUserProduct } from "../../../utils/auth";

function EmployeeTable() {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [actionType, setActionType] = useState("add");
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({
    emp_id: "",
    emp_name: "",
    emp_email: "",
    product_name: "",
    emp_role: "",
    site: "",
    is_active: false,
    date_of_joining: "",
  });
  const [selectedId, setSelectedId] = useState(null);

  // Get current user info
  const currentUser = getUserFromSession();
  const userRole = currentUser?.role || "EMPLOYEE";
  const userProduct = getUserProduct();

  // Fetch users
 const fetchUsers = async () => {
  try {
    const resp = await axios.get("http://localhost:8082/api/masters/getAllEmp");
    let data = Array.isArray(resp.data) ? resp.data : [];

    if (!isAdmin() && userProduct) {
      data = data.filter(emp => 
        emp.product_name?.trim().toLowerCase() === userProduct?.trim().toLowerCase()
      );
    }

    setUsers(data);
  } catch (err) {
    console.error("Error fetching users:", err);
  }
};


  useEffect(() => {
    fetchUsers();
  }, []);

  // Check permissions
  // const canAdd = canAddOrEdit();
  const canEdit = (user) => {
    if (isAdmin()) return true;
    if (isManager() && user?.product_name === userProduct) return true;
    return false;
  };
  // const canDeleteUser = (user) => {
  //   if (isAdmin()) return true;
  //   if (isManager() && user?.product_name === userProduct) return true;
  //   return false;
  // };

  const canAddUser = () => isAdmin() || isManager();
  const canEditUser = (user) => isAdmin() || (isManager() && user.product_name === userProduct);
  const canDeleteUser = (user) => isAdmin() || (isManager() && user.product_name === userProduct);


  const handleShow = (type) => {
    setActionType(type);
    if (type === "edit") {
      const user = users.find((u) => u.id === selectedId);
      if (!user) {
        alert("Please select a row to edit.");
        return;
      }
      if (!canEditUser(user)) {
        alert("You don't have permission to edit this employee.");
        return;
      }

      setEditingUserId(user.id);
      setFormData({ ...user });
    } else {
      setEditingUserId(null);
      setFormData({
        emp_id: "",
        emp_name: "",
        emp_email: "",
        product_name: isManager() ? userProduct : "", // Pre-fill for managers
        emp_role: "",
        site: "",
        is_active: false,
        date_of_joining: "",
      });
    }
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

const handleSave = async () => {
  try {
    const payload = {
      ...formData,
      emp_role: formData.emp_role.toUpperCase(), // convert here
    };

    if (actionType === "edit") {
      await axios.put("http://localhost:8082/api/masters/updateEmp", payload);
      setUsers((prev) => prev.map((u) => (u.id === payload.id ? payload : u)));
      alert("User updated successfully!");
    } else {
      await axios.post("http://localhost:8082/api/masters/saveEmp", payload);
      alert("User added successfully!");
      await fetchUsers();
    }
    handleClose();
  } catch (error) {
    console.error("Error saving user:", error);
    alert("Error saving user!");
  }
};


  const handleDelete = async () => {
    if (!selectedId) {
      alert("Please select a row to delete.");
      return;
    }
    const user = users.find((u) => u.id === selectedId);
    if (!user) {
      alert("Selected user not found.");
      setSelectedId(null);
      return;
    }
    if (!canDeleteUser(user)) {
      alert("You don't have permission to delete this employee.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete "${user.emp_name}"?`)) return;
    try {
      await axios.delete(`http://localhost:8082/api/masters/deleteEmp/${selectedId}`);
      alert("User deleted successfully!");
      await fetchUsers();
      setSelectedId(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user!");
    }
  };

  const handleRowClick = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <h3>Employee Table</h3>

  

      {isEmployee() && (
        <div className="alert alert-info py-2">
          You have read-only access as an Employee.
        </div>
      )}

      <div className="d-flex gap-2 mb-3">
       

        <Button
          style={{ backgroundColor: "#1A73E8" }}
          onClick={() => handleShow('add')}
          disabled={!canAddUser()}
        >
          Add
        </Button>

        <Button
          style={{ backgroundColor: "#1789e6ff" }}
          onClick={() => handleShow('edit')}
          disabled={!selectedId || !canEditUser(users.find(u => u.id === selectedId))}
        >
          Edit
        </Button>

        <Button
          style={{ backgroundColor: "#186ff3ff" }}
          onClick={handleDelete}
          disabled={!selectedId || !canDeleteUser(users.find(u => u.id === selectedId))}
        >
          Remove
        </Button>



      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Emp ID</th>
            <th>Emp Name</th>
            <th>Emp Email</th>
            <th>Product Name</th>
            <th>Emp Role</th>
            <th>Site</th>
            <th>Date of Joining</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center">No records found.</td>
            </tr>
          ) : (
            users.map((user) => {
              const isSelected = selectedId === user.id;
              return (
                <tr
                  key={user.id}
                  onClick={() => handleRowClick(user.id)}
                  className={isSelected ? "table-active" : ""}
                  style={{ cursor: "pointer" }}
                >
                  <td>{user.id}</td>
                  <td>{user.emp_id}</td>
                  <td>{user.emp_name}</td>
                  <td>{user.emp_email}</td>
                  <td>{user.product_name}</td>
                  <td>{user.emp_role}</td>
                  <td>{user.site}</td>
                  <td>{user.date_of_joining || "N/A"}</td>
                  <td style={{ color: user.is_active ? "green" : "red" }}>
                    {user.is_active ? "Active" : "Inactive"}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{actionType === "add" ? "Add User" : "Edit User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Emp ID <span style={{ color: "red" }}>*</span></Form.Label>
              <Form.Control type="text" name="emp_id" value={formData.emp_id} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Emp Name <span style={{ color: "red" }}>*</span></Form.Label>
              <Form.Control type="text" name="emp_name" value={formData.emp_name} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Emp Email <span style={{ color: "red" }}>*</span></Form.Label>
              <Form.Control type="email" name="emp_email" value={formData.emp_email} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Select
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                disabled={isManager()} // Manager can only add to their product
              >
                <option value="">Select Product</option>
                <option value="LIMS">LIMS</option>
                <option value="SDMS">SDMS</option>
                <option value="ELN">ELN</option>
                <option value="DMS">DMS</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Emp Role</Form.Label>
              <Form.Select name="emp_role" value={formData.emp_role} onChange={handleChange}>
                <option value="">Select Role</option>
                <option value="Administrator">Administrator</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Default Login Site</Form.Label>
              <Form.Select name="site" value={formData.site} onChange={handleChange}>
                <option value="">Select Site</option>
                <option value="Chennai">Chennai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date of Joining</Form.Label>
              <Form.Control type="date" name="date_of_joining" value={formData.date_of_joining} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3 d-flex align-items-center gap-2">
              <label htmlFor="is_active" className="mb-0">Active Status</label>
              <Form.Check type="checkbox" id="is_active" name="is_active" checked={Boolean(formData.is_active)} onChange={handleChange} className="m-0" />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleSave}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EmployeeTable;