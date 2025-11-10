import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import axios from 'axios';

function ProductTable() {
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
    product_id: '',
    product_name: '',
    budget_per_annum: '',
    total_employees: '',
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
      setFormData({ product_id: '', product_name: '', budget_per_annum: '', total_employees: '' });
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
        await axios.put("http://localhost:8082/api/masters/updateProduct", formData);
        console.log("given JSON to backend: " + formData);
        setUsers((prev) =>
          prev.map((user) =>
            user.id === formData.id ? { ...formData } : user
          )
        );
        alert("User updated successfully!");
      } else {
        // Add new record
        const response = await axios.post("http://localhost:8082/api/masters/saveProduct", formData);
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
      const response = await axios.get("http://localhost:8082/api/masters/getAllProduct");
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

      <h3>Product Table</h3>

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
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Budget Per Annum</th>
            <th>Total Employees</th>
            <th>Actions</th>
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
              <Form.Label>Product ID <span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control
                type="text"
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                required
              />
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
              <Form.Label>Budget Per Annum <span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control
                type="text"
                name="budget_per_annum"
                value={formData.budget_per_annum}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total Employees<span style={{ color: 'red' }}>*</span></Form.Label>
              <Form.Control
                type="text"
                name="total_employees"
                value={formData.total_employees}
                onChange={handleChange}
                required
              />
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

export default ProductTable;
