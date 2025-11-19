import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { BsPersonFillAdd } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import {
  getUserFromSession,
  isAdmin,
  isManager,
  isEmployee,
  getUserProduct,
} from "../../utils/auth";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function ProductTable() {
  const [rows, setRows] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [show, setShow] = useState(false);
  const [actionType, setActionType] = useState("add");
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    product_id: "",
    product_name: "",
    budget_per_annum: "",
    total_employees: "",
    team_lead_id: "",
  });

  // Current user info
  const currentUser = getUserFromSession();
  const userRole = currentUser?.role || "EMPLOYEE";
  const userProduct = getUserProduct();

  // Permission logic
  const canAdd = () => isAdmin() || isManager();
  const canEditProduct = (product) =>
    isAdmin() || (isManager() && product.product_name === userProduct);
  const canDeleteProduct = (product) =>
    isAdmin() || (isManager() && product.product_name === userProduct);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const resp = await axios.get(
        "http://localhost:9092/Org_Management_java/api/masters/getAllProduct"
      );
      let data = Array.isArray(resp.data) ? resp.data : [];

      if (!isAdmin() && userProduct) {
        data = data.filter(
          (p) =>
            p.product_name?.trim().toLowerCase() ===
            userProduct?.trim().toLowerCase()
        );
      }

      setProducts(data);

      // Format rows for DataGrid
      const formatted = data.map((item) => ({
        id: item.id,
        productId: item.product_id,
        productName: item.product_name,
        budgetPerAnnum: item.budget_per_annum,
        totalEmployees: item.total_employees,
        teamLeadName: item.team_lead_name,
      }));
      setRows(formatted);
    } catch (err) {
      console.error("Error fetching products:", err);
      alert("Error loading products. Check if backend API is running.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      const resp = await axios.get(
        "http://localhost:9092/Org_Management_java/api/masters/getAllEmp"
      );
      setEmployees(resp.data);
    };
    fetchEmployees();
  }, []);

  // Modal open/close
  const handleShow = (type) => {
    setActionType(type);

    if (type === "edit") {
      const product = products.find((p) => p.id === selectedId);
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
        team_lead_id: "",
      });
    }
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        budget_per_annum: parseFloat(formData.budget_per_annum || 0),
        total_employees: parseInt(formData.total_employees || 0, 10),
      };

      if (actionType === "edit") {
        await axios.put(
          `http://localhost:9092/Org_Management_java/api/masters/updateProduct/${payload.id}`,
          payload
        );
        setProducts((prev) =>
          prev.map((p) => (p.id === payload.id ? { ...payload } : p))
        );
        alert("Product updated successfully!");
        await fetchProducts();
      } else {
        // await axios.post("http://localhost:8082/api/masters/saveProduct", payload);
        if (actionType === "add") {
          const { product_id, ...payloadWithoutId } = payload;
          await axios.post(
            "http://localhost:9092/Org_Management_java/api/masters/saveProduct",
            payloadWithoutId
          );
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

    const product = products.find((p) => p.id === selectedId);
    if (!product) {
      alert("Selected product not found.");
      setSelectedId(null);
      return;
    }

    if (!canDeleteProduct(product)) {
      alert("You don't have permission to delete this product.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete "${product.product_name}"?`
      )
    )
      return;

    try {
      await axios.delete(
        `http://localhost:9092/Org_Management_java/api/masters/deleteProduct/${selectedId}`
      );
      alert("Product deleted successfully!");
      await fetchProducts();
      setSelectedId(null);
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Error deleting product!");
    }
  };

  const handleRowClick = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  // DataGrid columns
  const columns = [
    {
      field: "productId",
      headerName: "Product ID",
      flex: 1,
      minWidth: 130,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "productName",
      headerName: "Product Name",
      flex: 1,
      minWidth: 150,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "budgetPerAnnum",
      headerName: "Budget Per Annum",
      flex: 1,
      minWidth: 150,
      headerAlign: "left",
      align: "left",
      renderCell: (params) =>
        `₹${parseFloat(params.value || 0).toLocaleString()}`,
    },
    {
      field: "totalEmployees",
      headerName: "Total Employees",
      flex: 1,
      minWidth: 130,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "teamLeadName",
      headerName: "Team Lead",
      flex: 1,
      minWidth: 140,
      headerAlign: "left",
      align: "left",
      renderCell: (params) => params.value || "N/A",
    },
  ];

  return (
    <div>
      <h3>Product Table</h3>

      {isEmployee() && (
        <div className="alert alert-info py-2">
          You have read-only access as an Employee.
        </div>
      )}

      <div className="d-flex gap-2 mb-3">
        <Button
          style={{
            backgroundColor: "#1A73E8",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            justifyContent: "center",
          }}
          onClick={() => handleShow("add")}
          disabled={!canAdd()}
        >
          <BsPersonFillAdd size={16} />
          <span>Add</span>
        </Button>
        <Button
          style={{
            backgroundColor: "#1A73E8",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            justifyContent: "center",
          }}
          onClick={() => handleShow("edit")}
          disabled={
            !selectedId ||
            !canEditProduct(products.find((p) => p.id === selectedId))
          }
        >
          <FaEdit size={16} />
          <span>Edit</span>
        </Button>
        <Button
          style={{
            backgroundColor: "#1A73E8",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            justifyContent: "center",
          }}
          onClick={handleDelete}
          disabled={
            !selectedId ||
            !canDeleteProduct(products.find((p) => p.id === selectedId))
          }
        >
          <FaRegTrashAlt size={16} /> <span>Remove</span>
        </Button>
      </div>

      {/* <Table striped bordered hover responsive>
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
      </Table> */}

      {/* Data Grid */}

      <Box
        sx={{
          width: "100%",
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          autoHeight
          onRowClick={(params) => {
            setSelectedId((prev) =>
              prev === params.row.id ? null : params.row.id
            );
          }}
          disableColumnMenu={false}
          filterMode="client"
          slots={{
            toolbar: null,
          }}
          sx={{
            border: "none",
            height: "auto",
            "& .MuiDataGrid-main": {
              border: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              overflowX: "hidden",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f9fafb",
              borderBottom: "1px solid #e5e7eb",
              minHeight: "48px !important",
              maxHeight: "48px !important",
            },
            "& .MuiDataGrid-columnHeader": {
              padding: "0 16px",
              borderRight: "1px solid #e5e7eb",
              "&:last-child": {
                borderRight: "none",
              },
              "&:focus": {
                outline: "none",
              },
              "&:focus-within": {
                outline: "none",
              },
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontSize: "15px",
              fontWeight: "600",
              color: "#040404ff",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            },
            "& .MuiDataGrid-cell": {
              padding: "0 16px",
              fontSize: "14px",
              color: "#1f2937",
              borderBottom: "1px solid #f3f4f6",
              borderRight: "1px solid #e5e7eb",
              "&:last-child": {
                borderRight: "none",
              },
              "&:focus": {
                outline: "none",
              },
              "&:focus-within": {
                outline: "none",
              },
            },
            "& .MuiDataGrid-row": {
              "&:hover": {
                backgroundColor: "#eceef0ff",
                cursor: "pointer",
              },
              "&.Mui-selected": {
                backgroundColor: "#dae1e7ff !important", // Gray color when selected
                color: "#000000ff !important", // White text for better contrast
                "& .MuiDataGrid-cell": {
                  color: "#000000ff !important", // White text in cells
                },
              },
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
              minHeight: "52px",
              justifyContent: "center",
            },
            "& .MuiTablePagination-root": {
              color: "#6b7280",
              fontSize: "14px",
            },
            "& .MuiTablePagination-displayedRows": {
              margin: 0,
            },
            "& .MuiTablePagination-selectLabel": {
              margin: 0,
            },
            "& .MuiDataGrid-columnSeparator": {
              display: "none",
            },
          }}
        />
      </Box>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === "add" ? "Add Product" : "Edit Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {actionType === "edit" && (
              <Form.Group className="mb-3">
                <Form.Label>Product ID</Form.Label>
                <Form.Control
                  type="text"
                  name="product_id"
                  value={formData.product_id}
                  readOnly
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Product Name *</Form.Label>
              <Form.Control
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                required
                readOnly={isManager() || isEmployee()} // optional: managers/employees can't change
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Budget Per Annum *</Form.Label>
              <Form.Control
                type="number"
                name="budget_per_annum"
                value={formData.budget_per_annum}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total Employees *</Form.Label>
              <Form.Control
                type="number"
                name="total_employees"
                value={formData.total_employees}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Team Lead *</Form.Label>
              <Form.Select
                name="team_lead_id"
                value={formData.team_lead_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Team Lead</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.emp_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isEmployee()}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProductTable;
