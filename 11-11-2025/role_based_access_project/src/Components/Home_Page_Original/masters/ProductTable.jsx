import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { BsPersonFillAdd } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { getUserFromSession, isAdmin, isManager, isEmployee, getUserProduct } from "../../../utils/auth";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

function ProductTable() {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [show, setShow] = useState(false);
  const [actionType, setActionType] = useState("add");
  const [formData, setFormData] = useState({
    product_id: "",
    product_name: "",
    budget_per_annum: "",
    total_employees: "",
    team_lead_name: "",
  });

  // Current user info
  const currentUser = getUserFromSession();
  const userRole = currentUser?.role || "EMPLOYEE";
  const userProduct = getUserProduct();

  // Permission logic
  const canAdd = () => isAdmin() || isManager();
  const canEditProduct = (product) => isAdmin() || (isManager() && product.product_name === userProduct);
  const canDeleteProduct = (product) => isAdmin() || (isManager() && product.product_name === userProduct);


  //access check
  // const hasAccess = () => {
  //   if (!currentUser) return false; // Not logged in
  //   if (isAdmin()) return true; // Admin can see all
  //   if ((isManager() || isEmployee()) && currentUser.is_active) return true; // Only active users
  //   return false;
  // };


  //Bar chart data fetch
  useEffect(() => {
    axios.get("http://localhost:8082/api/products/fetchAllProducts")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);


  const barData = products.map((p) => ({
    product_name: p.product_name,
    budget_per_annum: p.budget_per_annum,
    total_employees: p.total_employees
  }));

  // Fetch products
  const fetchProducts = async () => {
    try {
      const resp = await axios.get("http://localhost:8082/api/masters/getAllProduct");
      let data = Array.isArray(resp.data) ? resp.data : [];

      if (!isAdmin() && userProduct) {
        data = data.filter(p => p.product_name?.trim().toLowerCase() === userProduct?.trim().toLowerCase());
      }

      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      alert("Error loading products. Check if backend API is running.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Modal open/close
  const handleShow = (type) => {
    setActionType(type);

    if (type === "edit") {
      const product = products.find(p => p.id === selectedId);
      if (!product) {
        alert("Please select a row to edit.");
        return;
      }
      if (!canEditProduct(product)) {
        alert("You don't have permission to edit this product.");
        return;
      }
      setFormData({ ...product });
    } else {
      setFormData({
        product_id: "",
        product_name: isManager() ? userProduct : "",
        budget_per_annum: "",
        total_employees: "",
        team_lead_name: "",
      });
    }
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        budget_per_annum: parseFloat(formData.budget_per_annum || 0),
        total_employees: parseInt(formData.total_employees || 0, 10),
      };

      if (actionType === "edit") {
        await axios.put(`http://localhost:8082/api/masters/updateProduct/${payload.id}`, payload);
        setProducts(prev => prev.map(p => (p.id === payload.id ? { ...payload } : p)));
        alert("Product updated successfully!");
      } else {
        // await axios.post("http://localhost:8082/api/masters/saveProduct", payload);
        if (actionType === "add") {
          const { product_id, ...payloadWithoutId } = payload;
          await axios.post("http://localhost:8082/api/masters/saveProduct", payloadWithoutId);
        }
        alert("Product added successfully!");
        await fetchProducts();
      }
      handleClose();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Error saving product!");
    }
  };

  const handleDelete = async () => {
    if (!selectedId) {
      alert("Please select a row to delete.");
      return;
    }

    const product = products.find(p => p.id === selectedId);
    if (!product) {
      alert("Selected product not found.");
      setSelectedId(null);
      return;
    }

    if (!canDeleteProduct(product)) {
      alert("You don't have permission to delete this product.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${product.product_name}"?`)) return;

    try {
      await axios.delete(`http://localhost:8082/api/masters/deleteProduct/${selectedId}`);
      alert("Product deleted successfully!");
      await fetchProducts();
      setSelectedId(null);
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Error deleting product!");
    }
  };

  const handleRowClick = (id) => {
    setSelectedId(prev => (prev === id ? null : id));
  };

  return (
    <div>
      <h3>Product Table</h3>

      {isEmployee() && (
        <div className="alert alert-info py-2">
          You have read-only access as an Employee.
        </div>
      )}

      <div className="d-flex gap-2 mb-3">
        <Button style={{
          backgroundColor: "#1A73E8", display: "flex",
          alignItems: "center",
          gap: "8px",
          justifyContent: "center"
        }} onClick={() => handleShow('add')} disabled={!canAdd()}>
          <BsPersonFillAdd size={16} /><span>Add</span>
        </Button>
        <Button style={{
          backgroundColor: "#1A73E8", display: "flex",
          alignItems: "center",
          gap: "8px",
          justifyContent: "center"
        }} onClick={() => handleShow('edit')} disabled={!selectedId || !canEditProduct(products.find(p => p.id === selectedId))}>
          <FaEdit size={16} /><span>Edit</span>
        </Button>
        <Button style={{
          backgroundColor: "#1A73E8",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          justifyContent: "center"
        }} onClick={handleDelete} disabled={!selectedId || !canDeleteProduct(products.find(p => p.id === selectedId))}>
          <FaRegTrashAlt size={16} /> <span>Remove</span>
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Budget Per Annum</th>
            <th>Total Employees</th>
            <th>Team Lead</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center">No records found.</td>
            </tr>
          ) : (
            products.map(p => {
              const isSelected = selectedId === p.id;
              return (
                <tr key={p.id} onClick={() => handleRowClick(p.id)} className={isSelected ? "table-active" : ""} style={{ cursor: "pointer" }}>
                  <td>{p.id}</td>
                  <td>{p.product_id}</td>
                  <td>{p.product_name}</td>
                  <td>₹{parseFloat(p.budget_per_annum || 0).toLocaleString()}</td>
                  <td>{p.total_employees}</td>
                  <td>{p.team_lead_name || "N/A"}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>


      {products.length === 0 ? (
        <p>Loading chart data...</p>
      ) : (
        <div>
          <h5 className="text-center mb-3">Product Table Visualization</h5>
          <div className="mt-4" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

            <BarChart width={700} height={300} data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="budget_per_annum" fill="#1A3D64" name="Annual Budget" />
              <Bar dataKey="total_employees" fill="#1D546C" name="Team Size" />
            </BarChart>
          </div>
        </div>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{actionType === "add" ? "Add Product" : "Edit Product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {actionType === "edit" && (
              <Form.Group className="mb-3">
                <Form.Label>Product ID</Form.Label>
                <Form.Control type="text" name="product_id" value={formData.product_id} readOnly />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Product Name *</Form.Label>
              <Form.Select name="product_name" value={formData.product_name} onChange={handleChange} disabled={isManager() || isEmployee()} required>
                {isAdmin() && (
                  <>
                    <option value="">Select Product</option>
                    <option value="LIMS">LIMS</option>
                    <option value="SDMS">SDMS</option>
                    <option value="ELN">ELN</option>
                    <option value="DMS">DMS</option>
                  </>
                )}
                {isManager() && <option value={userProduct}>{userProduct}</option>}
                {isEmployee() && <option value={userProduct}>{userProduct}</option>}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Budget Per Annum *</Form.Label>
              <Form.Control type="number" name="budget_per_annum" value={formData.budget_per_annum} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total Employees *</Form.Label>
              <Form.Control type="number" name="total_employees" value={formData.total_employees} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Team Lead Name *</Form.Label>
              <Form.Control type="text" name="team_lead_name" value={formData.team_lead_name} onChange={handleChange} required />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleSave} disabled={isEmployee()}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProductTable;
