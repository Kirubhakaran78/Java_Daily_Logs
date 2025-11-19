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

function EmployeeTable() {
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [products, setProducts] = useState([]);
  const [actionType, setActionType] = useState("add");
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({
    emp_id: "",
    emp_name: "",
    emp_email: "",
    // product_name: "",
    product_id: "",
    emp_role: "",
    site: "",
    is_active: false,
    date_of_joining: "",
  });
  const [selectedId, setSelectedId] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  // Get current user info
  const currentUser = getUserFromSession();
  const userRole = currentUser?.role || "EMPLOYEE";
  const userProduct = getUserProduct();

  // Fetch users
  const fetchUsers = async () => {
    try {
      const resp = await axios.get(
        "http://localhost:9092/Org_Management_java/api/masters/getAllEmp"
      );
      let data = Array.isArray(resp.data) ? resp.data : [];

      if (!isAdmin() && userProduct) {
        data = data
          .filter(
            (emp) =>
              emp.product_name?.trim().toLowerCase() ===
              userProduct?.trim().toLowerCase() // only same product
          )
          .filter(
            (emp) => emp.emp_role?.toLowerCase() === "employee" //  managers see only employees
          )
          .filter((emp) => emp.status !== "IN_PROGRESS")
          .filter((emp) => emp.is_active); // only active employees
      }

     
      let employees = data; // use filtered data, not full data

      

      employees = employees.map((emp) => ({
        ...emp,
        status_display: emp.is_active
          ? "ACTIVE"
          : emp.status === "IN_PROGRESS"
          ? "IN_PROGRESS"
          : "INACTIVE",
      }));

      employees.sort((a, b) => {
        if (
          a.status_display === "IN_PROGRESS" &&
          b.status_display !== "IN_PROGRESS"
        ) {
          return -1;
        }
        if (
          b.status_display === "IN_PROGRESS" &&
          a.status_display !== "IN_PROGRESS"
        ) {
          return 1;
        }
        return 0;
      });

      setUsers(employees);

      // Format rows for DataGrid
      const formatted = employees.map((item) => ({
        id: item.id,
        empId: item.emp_id,
        empName: item.emp_name,
        empEmail: item.emp_email,
        productName: item.product_name,
        empRole: item.emp_role,
        site: item.site,
        date_of_joining: item.date_of_joining,
        isActive: item.is_active,
        status_display: item.status_display, // NOW IT WORKS
      }));

      // SORT rows so IN_PROGRESS is always at the top
      formatted.sort((a, b) => {
        if (
          a.status_display === "IN_PROGRESS" &&
          b.status_display !== "IN_PROGRESS"
        )
          return -1;
        if (
          b.status_display === "IN_PROGRESS" &&
          a.status_display !== "IN_PROGRESS"
        )
          return 1;
        return 0;
      });

      setRows(formatted);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const resp = await axios.get(
        "http://localhost:9092/Org_Management_java/api/masters/getAllProduct"
      );
      setProducts(resp.data);
    };
    fetchProducts();
  }, []);

  // Check permissions
  // const canAdd = canAddOrEdit();
  const canEdit = (user) => {
    if (isAdmin()) return true;
    if (isManager() && user?.product_name === userProduct) return true;
    return false;
  };

  const canAddUser = () => isAdmin() || isManager();
  const canEditUser = (user) =>
    isAdmin() || (isManager() && user.product_name === userProduct);
  const canDeleteUser = (user) =>
    isAdmin() || (isManager() && user.product_name === userProduct);

  const handleShow = (type) => {
    setActionType(type);

    if (type === "edit") {
      const user = users.find((u) => u.id === selectedId);
      if (!user) {
        alert("Please select a row to edit.");
        return;
      }

      // Manager cannot edit themselves
      if (
        user.emp_email === currentUser.username ||
        user.emp_name === currentUser.username
      ) {
        alert("You cannot edit your own record.");
        return;
      }

      if (!canEditUser(user)) {
        alert("You don't have permission to edit this employee.");
        return;
      }

      setEditingUserId(user.id);
      setFormData({
        ...user,
        status: user.status,
        status_display: user.status_display,
      });

      // setFormData({ ...user });
    } else {
      setEditingUserId(null);
      setFormData({
        emp_id: "",
        emp_name: "",
        emp_email: "",
        product_id: isManager()
          ? products.find((p) => p.product_name === userProduct)?.id || ""
          : "",
        emp_role: isManager() ? "Employee" : "", //only Employee role for managers
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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
     

      const payload = {
        ...formData,
        emp_role: formData.emp_role.toUpperCase(),
        status: formData.is_active
          ? "ACTIVE"
          : formData.status || "IN_PROGRESS", // if not active & no status yet → IN_PROGRESS
      };

      if (actionType === "edit") {
        // --- UPDATE EXISTING EMPLOYEE ---
        await axios.put("http://localhost:9092/Org_Management_java/api/masters/updateEmp", payload);
        

        const status_display = payload.is_active
          ? "ACTIVE"
          : payload.status === "IN_PROGRESS"
          ? "IN_PROGRESS"
          : "INACTIVE";

        setUsers((prev) =>
          prev.map((u) =>
            u.id === payload.id ? { ...payload, status_display } : u
          )
        );

        setRows((prev) =>
          prev.map((r) => (r.id === payload.id ? { ...r, status_display } : r))
        );

        alert("User updated successfully!");
        await fetchUsers();
      } else {
        // --- ADD NEW EMPLOYEE ---
        const { emp_id, ...payloadWithoutId } = payload;

        // Save to backend and capture response
        const res = await axios.post(
          "http://localhost:9092/Org_Management_java/api/masters/saveEmp",
          payloadWithoutId
        );

        alert("User added successfully!");

        // If backend returns saved record, add it directly to table
        if (res.data) {
          const saved = res.data;


          const status_display = saved.is_active
            ? "ACTIVE"
            : saved.status === "IN_PROGRESS"
            ? "IN_PROGRESS"
            : "INACTIVE";

          

          setUsers((prev) => {
            const updated = [...prev, { ...saved, status_display }];

            updated.sort((a, b) => {
              if (
                a.status_display === "IN_PROGRESS" &&
                b.status_display !== "IN_PROGRESS"
              )
                return -1;
              if (
                b.status_display === "IN_PROGRESS" &&
                a.status_display !== "IN_PROGRESS"
              )
                return 1;
              return 0;
            });

            return updated;
          });

          // Update DataGrid Rows
          const newRow = {
            id: saved.id,
            empId: saved.emp_id,
            empName: saved.emp_name,
            empEmail: saved.emp_email,
            productName:
              products.find((p) => p.id === saved.product_id)?.product_name ||
              "",
            empRole: saved.emp_role,
            site: saved.site,
            date_of_joining: saved.date_of_joining,
            isActive: saved.is_active,
            status_display: status_display,
          };

          // setRows((prev) => [...prev, newRow]);
          setRows((prev) => {
            const updated = [...prev, newRow];

            updated.sort((a, b) => {
              if (
                a.status_display === "IN_PROGRESS" &&
                b.status_display !== "IN_PROGRESS"
              )
                return -1;
              if (
                b.status_display === "IN_PROGRESS" &&
                a.status_display !== "IN_PROGRESS"
              )
                return 1;
              return 0;
            });

            return updated;
          });
        } else {
          // fallback: refetch everything if backend doesn't return object
          await fetchUsers();
        }
      }

      handleClose();

      // Optional: reset form after saving
      setFormData({
        emp_id: "",
        emp_name: "",
        emp_email: "",
        product_id: isManager()
          ? products.find((p) => p.product_name === userProduct)?.id || ""
          : "",
        emp_role: isManager() ? "Employee" : "",
        site: "",
        is_active: false,
        date_of_joining: "",
      });
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

    if (user.is_active) {
      alert(
        "You cannot delete an ACTIVE employee. Please mark them as inactive first."
      );
      return;
    }

    if (!canDeleteUser(user)) {
      alert("You don't have permission to delete this employee.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete "${user.emp_name}"?`))
      return;
    try {
      await axios.delete(
        `http://localhost:9092/Org_Management_java/api/masters/deleteEmp/${selectedId}`
      );
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

  // DataGrid columns
  const columns = [
    {
      field: "empId",
      headerName: "Emp ID",
      flex: 1,
      minWidth: 120,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "empName",
      headerName: "Emp Name",
      flex: 1,
      minWidth: 150,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "empEmail",
      headerName: "Emp Email",
      flex: 1,
      minWidth: 200,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "productName",
      headerName: "Product Name",
      flex: 1,
      minWidth: 130,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "empRole",
      headerName: "Emp Role",
      flex: 1,
      minWidth: 130,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "site",
      headerName: "Site",
      flex: 1,
      minWidth: 120,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "date_of_joining",
      headerName: "Date of Joining",
      flex: 1,
      minWidth: 140,
      headerAlign: "left",
      align: "left",
      
    },
   
    {
      field: "status_display",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const s = params.row.status_display;

        return (
          <span
            style={{
              color:
                s === "IN_PROGRESS"
                  ? "#d97706"
                  : s === "ACTIVE"
                  ? "#16a34a"
                  : "#dc2626",
              fontWeight: 600,
            }}
          >
            {s}
          </span>
        );
      },
    },
  ];

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
          style={{
            backgroundColor: "#1A73E8",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            justifyContent: "center",
          }}
          onClick={() => handleShow("add")}
          disabled={!canAddUser()}
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
            !selectedId || !canEditUser(users.find((u) => u.id === selectedId))
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
            !canDeleteUser(users.find((u) => u.id === selectedId))
          }
        >
          <FaRegTrashAlt size={16} /> <span>Remove</span>
        </Button>
      </div>

      {/* <Table striped bordered hover responsive>
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
              overflowY: "hidden", // ADD THIS LINE
              "&::-webkit-scrollbar": {
                // ADD THIS BLOCK
                display: "none",
              },
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
              color: "#080808ff",
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
                color: "#000000ff !important", // black text for better contrast
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
            {actionType === "add" ? "Add User" : "Edit User"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {actionType === "edit" && (
              <Form.Group className="mb-3">
                <Form.Label>
                  Emp ID <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="emp_id"
                  value={formData.emp_id}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>
                Emp Name <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="emp_name"
                value={formData.emp_name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Emp Email <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="email"
                name="emp_email"
                value={formData.emp_email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* <Form.Group className="mb-3">
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
            </Form.Group> */}

            <Form.Group className="mb-3">
              <Form.Label>Product</Form.Label>
              <Form.Select
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                disabled={isManager()}
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.product_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* <Form.Group className="mb-3">
              <Form.Label>Emp Role</Form.Label>
              <Form.Select name="emp_role" value={formData.emp_role} onChange={handleChange}>
                <option value="">Select Role</option>
                <option value="Administrator">Administrator</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
              </Form.Select>
            </Form.Group> */}

            <Form.Group className="mb-3">
              <Form.Label>Emp Role</Form.Label>
              <Form.Select
                name="emp_role"
                value={formData.emp_role}
                onChange={handleChange}
                disabled={isManager()} // Manager cannot change role manually
              >
                <option value="">
                  {isManager() ? "Employee" : "Select Role"}
                </option>
                {isAdmin() && (
                  <>
                    <option value="Administrator">Administrator</option>
                    <option value="Manager">Manager</option>
                  </>
                )}
                <option value="Employee">Employee</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Default Login Site</Form.Label>
              <Form.Select
                name="site"
                value={formData.site}
                onChange={handleChange}
              >
                <option value="">Select Site</option>
                <option value="Chennai">Chennai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date of Joining</Form.Label>
              <Form.Control
                type="date"
                name="date_of_joining"
                value={formData.date_of_joining}
                onChange={handleChange}
                max={today}
              />
            </Form.Group>

            <Form.Group className="mb-3 d-flex align-items-center gap-2">
              <label htmlFor="is_active" className="mb-0">
                Active Status
              </label>
              <Form.Check
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={Boolean(formData.is_active)}
                onChange={handleChange}
                className="m-0"
                disabled={
                  !(
                    isAdmin() ||
                    (isManager() &&
                      formData.emp_role?.toLowerCase() === "employee")
                  )
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EmployeeTable;
