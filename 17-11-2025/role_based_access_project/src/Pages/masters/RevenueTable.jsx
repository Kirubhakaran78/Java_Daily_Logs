import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { Chart } from "react-google-charts";
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
import { Box, Typography } from "@mui/material";

function RevenueTable() {
  //data grid columns
  const [rows, setRows] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [show, setShow] = useState(false);
  const [actionType, setActionType] = useState("add");
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    revenue_id: "",
    product_id: "",
    month_year: "",
    revenue_amount: "",
    expense_amount: "",
    // profit: "",
    client_name: "",
  });

  // Get current user info
  const currentUser = getUserFromSession();
  const userRole = currentUser?.role || "EMPLOYEE";
  const userProduct = getUserProduct();

  const today = new Date().toISOString().split("T")[0];

  //access check
  //access check
  // const hasAccess = () => {
  //   if (!currentUser) return false; // Not logged in
  //   if (isAdmin()) return true; // Admin can see all
  //   if ((isManager() || isEmployee()) && currentUser.is_active) return true; // Only active users
  //   return false;
  // };

  // Permissions
  const canAdd = () => isAdmin() || isManager();
  const canEdit = (rev) =>
    isAdmin() || (isManager() && rev.product_name === userProduct);
  const canDelete = (rev) =>
    isAdmin() || (isManager() && rev.product_name === userProduct);

  // Fetch revenues
  const fetchRevenues = async () => {
    console.log("fetchRevenues called");
    try {
      const resp = await axios.get(
        "http://localhost:8082/api/masters/getAllRevenue"
      );
      let data = Array.isArray(resp.data) ? resp.data : [];

      console.log("fetched the data");

      if (!isAdmin() && userProduct) {
        data = data.filter(
          (r) =>
            r.product_name?.trim().toLowerCase() ===
            userProduct?.trim().toLowerCase()
        );
      }

      setRevenues(data);

      //Format rows for DataGrid
      const formatted = data.map((item) => ({
        id: item.id,
        revenueId: item.revenue_id,
        productName: item.product_name,
        monthYear: item.month_year,
        revenueAmount: item.revenue_amount,
        expenseAmount: item.expense_amount,
        profit: item.profit,
        clientName: item.client_name,
      }));
      setRows(formatted);

      //debug
      console.log("Formatted rows:", formatted); // Add this
      console.log("Rows state:", rows); // Add this
    } catch (err) {
      console.error("Error fetching revenues:", err);
      alert("Error loading revenues. Check if backend API is running.");
    }
  };

  useEffect(() => {
    fetchRevenues();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const resp = await axios.get("http://localhost:8082/api/masters/getAllProduct");
      setProducts(resp.data);
    };
    fetchProducts();
  }, []);

  const handleShow = (type) => {
    if (isEmployee()) {
      alert("You don't have permission to add or edit.");
      return;
    }

    setActionType(type);

    if (type === "edit") {
      const rev = revenues.find((r) => r.id === selectedId);
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
        product_id: isManager() ? (products.find(p => p.product_name === userProduct)?.id || "") : "",
        month_year: "",
        revenue_amount: "",
        expense_amount: "",
        client_name: "",
      });
    }

    setShow(true);
  };

  const handleClose = () => setShow(false);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => {
  //     const updated = { ...prev, [name]: value };
  //     if (name === "revenue_amount" || name === "expense_amount") {
  //       const revenue = parseFloat(updated.revenue_amount) || 0;
  //       const expense = parseFloat(updated.expense_amount) || 0;
  //       updated.profit = (revenue - expense).toFixed(2);
  //     }
  //     return updated;
  //   });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (actionType === "edit") {
        await axios.put(
          "http://localhost:8082/api/masters/updateRevenue",
          formData
        );
        setRevenues((prev) =>
          prev.map((r) => (r.id === formData.id ? { ...formData } : r))
        );
        alert("Revenue updated successfully!");
        await fetchRevenues();
      } else {
        // await axios.post("http://localhost:8082/api/masters/saveRevenue", formData);
        if (actionType === "add") {
          const { revenue_id, ...payloadWithoutId } = formData; // use formData instead of payload
          await axios.post(
            "http://localhost:8082/api/masters/saveRevenue",
            payloadWithoutId
          );
        }
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
    const rev = revenues.find((r) => r.id === selectedId);
    if (!rev) {
      alert("Selected revenue not found.");
      setSelectedId(null);
      return;
    }
    if (!canDelete(rev)) {
      alert("You don't have permission to delete this revenue.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete "${rev.revenue_id}"?`))
      return;
    try {
      await axios.delete(
        `http://localhost:8082/api/masters/deleteRevenue/${selectedId}`
      );
      alert("Revenue deleted successfully!");
      await fetchRevenues();
      setSelectedId(null);
    } catch (err) {
      console.error("Error deleting revenue:", err);
      alert("Error deleting revenue!");
    }
  };

  const handleRowClick = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const columns = [
    {
      field: "revenueId",
      headerName: "Revenue ID",
      flex: 1,
      minWidth: 130,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "productName",
      headerName: "Product",
      flex: 1,
      minWidth: 120,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "monthYear",
      headerName: "Month-Year",
      flex: 1,
      minWidth: 120,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "revenueAmount",
      headerName: "Revenue",
      flex: 1,
      minWidth: 130,
      headerAlign: "left",
      align: "left",
      renderCell: (params) =>
        `₹${parseFloat(params.value || 0).toLocaleString()}`,
    },
    {
      field: "expenseAmount",
      headerName: "Expense",
      flex: 1,
      minWidth: 130,
      headerAlign: "left",
      align: "left",
      renderCell: (params) =>
        `₹${parseFloat(params.value || 0).toLocaleString()}`,
    },
    {
      field: "profit",
      headerName: "Profit",
      flex: 1,
      minWidth: 130,
      headerAlign: "left",
      align: "left",
      renderCell: (params) => {
        const profit = parseFloat(params.value || 0);
        return (
          <span
            style={{
              color: profit >= 0 ? "#22c55e" : "#ef4444",
              fontWeight: "500",
            }}
          >
            ₹{profit.toLocaleString()}
          </span>
        );
      },
    },
    {
      field: "clientName",
      headerName: "Client",
      flex: 1,
      minWidth: 120,
      headerAlign: "left",
      align: "left",
    },
  ];

  console.log("Columns:", columns);
  return (
    <div>
      <h3>Revenue Table</h3>

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
            !selectedId || !canEdit(revenues.find((r) => r.id === selectedId))
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
            !selectedId || !canDelete(revenues.find((r) => r.id === selectedId))
          }
        >
          <FaRegTrashAlt size={16} /> <span>Remove</span>
        </Button>
      </div>

      {/* <Table striped bordered hover responsive>
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
      </Table> */}


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
                  color: "#020202ff !important", // White text in cells
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
            {actionType === "add" ? "Add Revenue" : "Edit Revenue"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {actionType === "edit" && (
              <Form.Group className="mb-3">
                <Form.Label>Revenue ID *</Form.Label>
                <Form.Control
                  type="text"
                  name="revenue_id"
                  value={formData.revenue_id}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </Form.Group>
            )}



            <Form.Group className="mb-3">
              <Form.Label>Product *</Form.Label>
              <Form.Select
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                disabled={isManager() || isEmployee()}>
                <option value="">Select Product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.product_name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Month-Year *</Form.Label>
              <Form.Control
                type="date"
                name="month_year"
                value={formData.month_year}
                onChange={handleChange}
                // min={today}
                max={today}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Revenue Amount *</Form.Label>
              <Form.Control
                type="number"
                name="revenue_amount"
                value={formData.revenue_amount}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Expense Amount *</Form.Label>
              <Form.Control
                type="number"
                name="expense_amount"
                value={formData.expense_amount}
                onChange={handleChange}
                required
              />
            </Form.Group>


            <Form.Group className="mb-3">
              <Form.Label>Client Name</Form.Label>
              <Form.Control
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
              />
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

      {/* {revenues.length > 0 && (
        <div className="mt-4">
          <Chart
            chartType="PieChart"
            data={getPieChartData()}
            options={chartOptions}
            width={"100%"}
            height={"400px"}
          />
        </div>
      )} */}
    </div>
  );
}

export default RevenueTable;
