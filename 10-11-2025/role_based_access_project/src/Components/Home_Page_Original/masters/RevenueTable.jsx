import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import { Chart } from "react-google-charts";

function RevenueTable() {

//pie chart
const data = [
    ["Budget per Product", "budget per annum"],
    ["total_product", 4],
    ["Eat", 2],
    ["Commute", 2],
    ["Watch TV", 2],
    ["Sleep", 7],
  ];

  const options = {
    title: "My Daily Activities",
  };



  // State for all users
  const [users, setUsers] = useState([
    {},
  ]);

  // State for modal visibility & type
  const [show, setShow] = useState(false);
  const [actionType, setActionType] = useState('add');  //keeps track of Add or Edit.
  const [editingUserId, setEditingUserId] = useState(null); //stores the id of the user being edited. -> helps the handlesave to know which id

  // Form state
  const [formData, setFormData] = useState({  //formData stores all input field values in the modal. input name represent the formdata property
    emp_id: '',
    emp_name: '',
    emp_email: '',
    product_name: '',
    emp_role: '',
    site: '',
    approve: false
  });

  const handleClose = () => setShow(false);

  // Open modal for Add or Edit
  const handleShow = (type, user = null) => {
    setActionType(type);

    if (type === 'edit' && user) {
      setEditingUserId(user.id);
      setFormData({ ...user }); // pre-fill data
    } else {
      setEditingUserId(null);
      setFormData({ emp_id: '', emp_name: '', emp_email: '', product_name: '', emp_role: '', site: '', approve: false });
    }

    setShow(true);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };


  const handleSave = async () => {
    console.log("Form Data before saving:", formData);
    try {
      if (actionType === 'edit') {
        // Update existing record
        await axios.put("http://localhost:8082/api/masters/updateMaster", formData);
        console.log("given JSON to backend: " + formData);
        setUsers((prev) =>
          prev.map((user) =>
            user.id === formData.id ? { ...formData } : user
          )
        );
        alert("User updated successfully!");
      } else {
        // Add new record
        const response = await axios.post("http://localhost:8082/api/masters/saveMaster", formData);
        alert("User added successfully!");
        fetchUsers(); // reload after add
      }

      handleClose();
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Error saving user!");
    }
  };


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

      <h3>Revenue Table</h3>

      {/* Add/Edit Buttons */}
      <div className="d-flex flex gap-2 mb-3">
        <Button variant="primary" onClick={() => handleShow('add')}>Add User</Button>
        {users.length > 0 && (
          <Button variant="warning" onClick={() => handleShow('edit', users[0])}>Edit User</Button>
        )}
      </div>

      {/* Users Table */}
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
            <th>Actions</th>
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
              <td>
                <Button size="sm" variant="warning" onClick={() => handleShow('edit', user)}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{actionType === 'add' ? 'Add User' : 'Edit User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>

            <Form.Group className="mb-3">
              <Form.Label>Emp ID <span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control
                type="text"
                name="emp_id"
                value={formData.emp_id}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Emp Name <span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control
                type="text"
                name="emp_name"
                value={formData.emp_name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Emp Email <span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control
                type="email"
                name="emp_email"
                value={formData.emp_email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
              />
              <span style={{ color: 'grey', fontSize: '12px' }}>
                Note: This mail is to recover the forgot password
              </span>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Select name="product_name" value={formData.product_name} onChange={handleChange}>
                <option value="">Select Product</option>
                <option value="SDMS">SDMS</option>
                <option value="LIMS">LIMS</option>
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

            <Form.Group className="mb-3 d-flex align-items-center gap-2">
              <label htmlFor="approve" className="mb-0">Approve</label>
              <Form.Check
                type="checkbox"
                id="approve"
                name="approve"
                checked={Boolean(formData.approve)}
                onChange={handleChange}
                className="m-0"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleSave}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      height={"400px"}
    />
    </div>
  );
}

export default RevenueTable;
