import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { Chart } from "react-google-charts";
import { getUserFromSession, isAdmin, isManager, isEmployee, getUserProduct } from "../../../utils/auth";

function RevenueTable() {
  const [revenues, setRevenues] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [show, setShow] = useState(false);
  const [actionType, setActionType] = useState("add");
  const [formData, setFormData] = useState({
    revenue_id: "",
    product_name: "",
    month_year: "",
    revenue_amount: "",
    expense_amount: "",
    profit: "",
    client_name: ""
  });

  // Get current user info
  const currentUser = getUserFromSession();
  const userRole = currentUser?.role || "EMPLOYEE";
  const userProduct = getUserProduct();

  // Permissions
  const canAdd = () => isAdmin() || isManager();
  const canEdit = (rev) => isAdmin() || (isManager() && rev.product_name === userProduct);
  const canDelete = (rev) => isAdmin() || (isManager() && rev.product_name === userProduct);

  // Fetch revenues
  const fetchRevenues = async () => {
    try {
      const resp = await axios.get("http://localhost:8082/api/masters/getAllRevenue");
      let data = Array.isArray(resp.data) ? resp.data : [];

      if (!isAdmin() && userProduct) {
        data = data.filter(r => r.product_name?.trim().toLowerCase() === userProduct?.trim().toLowerCase());
      }

      setRevenues(data);
    } catch (err) {
      console.error("Error fetching revenues:", err);
      alert("Error loading revenues. Check if backend API is running.");
    }
  };

  useEffect(() => {
    fetchRevenues();
  }, []);

  const handleShow = (type) => {
    if (isEmployee()) {
      alert("You don't have permission to add or edit.");
      return;
    }

    setActionType(type);

    if (type === "edit") {
      const rev = revenues.find(r => r.id === selectedId);
      if (!rev) {
        alert("Please select a row to edit.");
        return;
      }
      if (!canEdit(rev)) {
        alert("You don't have permission to edit this revenue.");
        return;
      }
      setFormData({ ...rev });
    } else {
      setFormData({
        revenue_id: "",
        product_name: isManager() ? userProduct : "",
        month_year: "",
        revenue_amount: "",
        expense_amount: "",
        profit: "",
        client_name: ""
      });
    }

    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === "revenue_amount" || name === "expense_amount") {
        const revenue = parseFloat(updated.revenue_amount) || 0;
        const expense = parseFloat(updated.expense_amount) || 0;
        updated.profit = (revenue - expense).toFixed(2);
      }
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      if (actionType === "edit") {
        await axios.put("http://localhost:8082/api/masters/updateRevenue", formData);
        setRevenues(prev => prev.map(r => (r.id === formData.id ? { ...formData } : r)));
        alert("Revenue updated successfully!");
      } else {
        await axios.post("http://localhost:8082/api/masters/saveRevenue", formData);
        alert("Revenue added successfully!");
        await fetchRevenues();
      }
      handleClose();
    } catch (err) {
      console.error("Error saving revenue:", err);
      alert("Error saving revenue!");
    }
  };

  const handleDelete = async () => {
    if (!selectedId) {
      alert("Please select a row to delete.");
      return;
    }
    const rev = revenues.find(r => r.id === selectedId);
    if (!rev) {
      alert("Selected revenue not found.");
      setSelectedId(null);
      return;
    }
    if (!canDelete(rev)) {
      alert("You don't have permission to delete this revenue.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete "${rev.revenue_id}"?`)) return;
    try {
      await axios.delete(`http://localhost:8082/api/masters/deleteRevenue/${selectedId}`);
      alert("Revenue deleted successfully!");
      await fetchRevenues();
      setSelectedId(null);
    } catch (err) {
      console.error("Error deleting revenue:", err);
      alert("Error deleting revenue!");
    }
  };

  const handleRowClick = (id) => {
    setSelectedId(prev => (prev === id ? null : id));
  };

  // Pie Chart
  const getPieChartData = () => {
    if (revenues.length === 0) return [["Product", "Profit"]];
    const chartData = [["Product", "Profit"]];
    const productProfits = {};
    revenues.forEach(r => {
      const product = r.product_name || "Unknown";
      const profit = parseFloat(r.profit) || 0;
      productProfits[product] = (productProfits[product] || 0) + profit;
    });
    Object.entries(productProfits).forEach(([p, profit]) => chartData.push([p, profit]));
    return chartData;
  };
  const chartOptions = { title: "Profit by Product", pieHole: 0.4, colors: ["#1A73E8","#34A853","#FBBC04","#EA4335"] };

  return (
    <div>
      <h3>Revenue Table</h3>

      {isEmployee() && (
        <div className="alert alert-info py-2">You have read-only access as an Employee.</div>
      )}

      <div className="d-flex gap-2 mb-3">
        <Button style={{ backgroundColor: "#1A73E8" }} onClick={() => handleShow("add")} disabled={!canAdd()}>
          Add
        </Button>
        <Button style={{ backgroundColor: "#1789e6ff" }} onClick={() => handleShow("edit")} disabled={!selectedId || !canEdit(revenues.find(r => r.id === selectedId))}>
          Edit
        </Button>
        <Button style={{ backgroundColor: "#186ff3ff" }} onClick={handleDelete} disabled={!selectedId || !canDelete(revenues.find(r => r.id === selectedId))}>
          Remove
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Revenue ID</th>
            <th>Product Name</th>
            <th>Month-Year</th>
            <th>Revenue Amount</th>
            <th>Expense Amount</th>
            <th>Profit</th>
            <th>Client Name</th>
          </tr>
        </thead>
        <tbody>
          {revenues.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center">No records found.</td>
            </tr>
          ) : (
            revenues.map(r => {
              const isSelected = selectedId === r.id;
              return (
                <tr key={r.id} onClick={() => handleRowClick(r.id)} className={isSelected ? "table-active" : ""} style={{ cursor: "pointer" }}>
                  <td>{r.id}</td>
                  <td>{r.revenue_id}</td>
                  <td>{r.product_name}</td>
                  <td>{r.month_year}</td>
                  <td>₹{parseFloat(r.revenue_amount || 0).toLocaleString()}</td>
                  <td>₹{parseFloat(r.expense_amount || 0).toLocaleString()}</td>
                  <td style={{ color: r.profit >= 0 ? "green" : "red", fontWeight: "bold" }}>₹{parseFloat(r.profit || 0).toLocaleString()}</td>
                  <td>{r.client_name}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{actionType === "add" ? "Add Revenue" : "Edit Revenue"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Revenue ID *</Form.Label>
              <Form.Control type="text" name="revenue_id" value={formData.revenue_id} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product Name *</Form.Label>
              <Form.Select
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                disabled={isManager() || isEmployee()} // Manager/Employee cannot change
              >
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
              <Form.Label>Month-Year *</Form.Label>
              <Form.Control type="text" name="month_year" value={formData.month_year} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Revenue Amount *</Form.Label>
              <Form.Control type="number" name="revenue_amount" value={formData.revenue_amount} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Expense Amount *</Form.Label>
              <Form.Control type="number" name="expense_amount" value={formData.expense_amount} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Profit (Auto-calculated)</Form.Label>
              <Form.Control type="text" name="profit" value={formData.profit} readOnly style={{ backgroundColor: '#f0f0f0' }} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Client Name</Form.Label>
              <Form.Control type="text" name="client_name" value={formData.client_name} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleSave} disabled={isEmployee()}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {revenues.length > 0 && (
        <div className="mt-4">
          <Chart chartType="PieChart" data={getPieChartData()} options={chartOptions} width={"100%"} height={"400px"} />
        </div>
      )}
    </div>
  );
}

export default RevenueTable;
