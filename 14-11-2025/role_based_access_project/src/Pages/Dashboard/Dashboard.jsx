import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col } from "react-bootstrap";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell /* Pie, Area, AreaChart  */,
} from "recharts";
import { Chart } from "react-google-charts";
import { PieChart } from "@mui/x-charts/PieChart";

import "./Dashboard.css";

// Format numbers as currency
function formatCurrency(val) {
  if (val === null || val === undefined || val === "") return "₹0";
  const n = Number(val);
  if (Number.isNaN(n)) return val;
  return "₹" + n.toLocaleString();
}

// Format large numbers
const formatLargeNumber = (num) => {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num;
};

function Dashboard() {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("currentUser") || "{}")
  );

  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyPerformance, setCompanyPerformance] = useState([]);
  const [productComparison, setProductComparison] = useState([]);

  // New state for role-specific charts
  const [revenueByProduct, setRevenueByProduct] = useState([]);
  const [productPerformance, setProductPerformance] = useState([]);
  const [yearComparison, setYearComparison] = useState([]);
  const [topClients, setTopClients] = useState([]);
  const [monthlyGrowth, setMonthlyGrowth] = useState(0);
  const [monthlySalesDistribution, setMonthlySalesDistribution] = useState([]);

  // SINGLE useEffect to fetch ALL data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // STEP 1: Fetch fresh user data with is_active status
        if (currentUser?.username) {
          const userRes = await axios.get(
            `http://localhost:8082/api/users/currentUser?username=${currentUser.username}`
          );
          sessionStorage.setItem("currentUser", JSON.stringify(userRes.data));
          setCurrentUser(userRes.data);
        }

        // STEP 2: Fetch common data for all roles
        const [empRes, prodRes, revRes, perfRes, compRes] = await Promise.all([
          axios.get("http://localhost:8082/api/masters/getAllEmp"),
          axios.get("http://localhost:8082/api/masters/getAllProduct"),
          axios.get("http://localhost:8082/api/masters/getAllRevenue"),
          axios.get("http://localhost:8082/api/masters/getCompanyPerformance"),
          axios.get("http://localhost:8082/api/masters/getProductComparison"),
        ]);

        setEmployees(empRes.data || []);
        setProducts(prodRes.data || []);
        setRevenues(revRes.data || []);
        setProductComparison(compRes.data || []);

        // Process company performance
        let perfData = perfRes.data;
        if (perfData?.data) perfData = perfData.data;
        if (!Array.isArray(perfData)) perfData = [];

        const converted = perfData.map((item) => ({
          year: Number(item.year) || item.year?.toString() || "Unknown",
          sales: Number(item.sales) || 0,
          expenses: Number(item.expenses) || Number(item.sales) * 0.1 || 0,
        }));
        setCompanyPerformance(converted);

        // STEP 3: Fetch role-specific data
        const userRole = currentUser?.role?.toUpperCase();
        const userProduct = currentUser?.product_name;

        if (userRole === "ADMIN") {
          // Admin: Fetch revenue distribution by product
          const revByProd = await axios.get(
            "http://localhost:8082/api/masters/getRevenueByProduct"
          );
          setRevenueByProduct(revByProd.data || []);
        } else if (
          (userRole === "MANAGER" || userRole === "EMPLOYEE") &&
          userProduct
        ) {
          // Manager/Employee: Fetch product-specific data
          const [perfRes, yearRes, clientsRes, growthRes] = await Promise.all([
            axios.get(
              `http://localhost:8082/api/masters/getProductPerformance?productName=${userProduct}`
            ),
            axios.get(
              `http://localhost:8082/api/masters/getYearComparison?productName=${userProduct}`
            ),
            axios.get(
              `http://localhost:8082/api/masters/getTopClients?productName=${userProduct}`
            ),
            axios.get(
              `http://localhost:8082/api/masters/getMonthlyGrowth?productName=${userProduct}`
            ),
          ]);

          setProductPerformance(perfRes.data || []);
          setYearComparison(yearRes.data || []);
          setTopClients(clientsRes.data || []);
          setMonthlyGrowth(growthRes.data?.growthPercentage || 0);

          // Debug log
          console.log("Year Comparison Data:", yearRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Role-based filtering
  const isAdmin = currentUser?.role?.toUpperCase() === "ADMIN";
  const userProduct = currentUser?.product_name?.trim().toLowerCase();

  const filteredEmployees = employees.filter((emp) => {
    if (isAdmin) return true;
    return emp.product_name?.trim().toLowerCase() === userProduct;
  });

  const filteredProducts = products.filter((prod) => {
    if (isAdmin) return true;
    return prod.product_name?.trim().toLowerCase() === userProduct;
  });

  const filteredRevenues = revenues.filter((rev) => {
    if (isAdmin) return true;
    return rev.product_name?.trim().toLowerCase() === userProduct;
  });

  // Calculate KPIs
  const totalRevenue = filteredRevenues.reduce(
    (sum, r) => sum + (parseFloat(r.revenue_amount) || 0),
    0
  );
  const totalSales = filteredRevenues.length;
  const totalClients = new Set(filteredRevenues.map((r) => r.client_name)).size;
  const avgRevenue = totalSales > 0 ? totalRevenue / totalSales : 0;
  const totalEmpCount = filteredEmployees.filter(
    (e) => e.emp_role?.toUpperCase() === "EMPLOYEE"
  ).length;
  const totalEmployees = filteredEmployees.length;
  const totalManagers = filteredEmployees.filter(
    (e) => e.emp_role?.toUpperCase() === "MANAGER"
  ).length;
  const totalTeams = filteredProducts.length;

  // Top performing team (by revenue)
  const productRevenues = {};
  filteredRevenues.forEach((r) => {
    const product = r.product_name || "Unknown";
    productRevenues[product] =
      (productRevenues[product] || 0) + (parseFloat(r.revenue_amount) || 0);
  });
  const topTeam =
    Object.entries(productRevenues).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "N/A";

  // Product comparison chart
  const productComparisonChart = React.useMemo(() => {
    if (!productComparison.length) return [["Product", "2024", "2025"]];

    const years = [...new Set(productComparison.map((item) => item.year))]
      .sort()
      .reverse();
    const [year1, year2] = years;

    const grouped = {};
    productComparison.forEach((item) => {
      if (!grouped[item.product]) {
        grouped[item.product] = { [year1]: 0, [year2]: 0 };
      }
      grouped[item.product][item.year] = item.count;
    });
    return [
      ["Product", String(year1), String(year2)],
      ...Object.entries(grouped).map(([product, val]) => [
        product,
        val[year1] || 0,
        val[year2] || 0,
      ]),
    ];
  }, [productComparison]);

  // Revenue Distribution Pie Chart (for Admin)
  const revenueDistributionData = revenueByProduct.map((item) => ({
    name: item.product,
    value: Number(item.total_revenue),
  }));

  const COLORSPIE = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F"];

  // Total for percentage calculation
  const totalRevenueForPie = revenueDistributionData.reduce(
    (sum, item) => sum + (item.value || 0),
    0
  );

  // MUI PieChart expects: [{ id, value, label }]
  const revenuePieSeriesData = revenueDistributionData.map((item, index) => ({
    id: index,
    value: item.value,
    label: item.name,
    color: COLORSPIE[index % COLORSPIE.length],
  }));

  // MUI value formatter (on hover tooltip)
  const pieValueFormatter = (item) => {
    const pct =
      totalRevenueForPie > 0
        ? ((item.value / totalRevenueForPie) * 100).toFixed(1)
        : 0;
    return `${item.label}: ₹${formatLargeNumber(item.value)} (${pct}%)`;
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // Year Comparison Chart Data - Sales Count per Year (for Manager/Employee)
  const yearComparisonData = React.useMemo(() => {
    if (!yearComparison.length) return [];

    return yearComparison.map((item) => ({
      year: String(item.year),
      sales: Number(item.sales),
    }));
  }, [yearComparison]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h4>Loading dashboard...</h4>
      </div>
    );
  }

  const allowedRoles = ["ADMIN", "MANAGER", "EMPLOYEE"];
  if (!allowedRoles.includes(currentUser?.role?.toUpperCase())) {
    return (
      <div className="text-center mt-5">
        <h4>You need access to view this page.</h4>
      </div>
    );
  }

  if (currentUser?.is_active === false) {
    return (
      <div className="text-center mt-5">
        <h4>Your account is still in progress.</h4>
        <p>Please wait for the admin to activate your account.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        // marginTop: "25px",
      }}
    >
      <h2 className="mb-4">Dashboard</h2>

      {/* KPI Cards */}
      <Row className="mb-4">
        {/* ADMIN KPI Cards */}
        {isAdmin ? (
          <>
            <Col md={2}>
              <Card
                style={{
                  borderLeft: "4px solid #ff9800",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Body>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Total Employees
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginTop: "8px",
                    }}
                  >
                    {totalEmployees}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={2}>
              <Card
                style={{
                  borderLeft: "4px solid #9c27b0",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Body>
                  <div style={{ fontSize: "12px", color: "#666" }}>Teams</div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginTop: "8px",
                    }}
                  >
                    {totalTeams}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={2}>
              <Card
                style={{
                  borderLeft: "4px solid #2196F3",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Body>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Total Revenue
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginTop: "8px",
                    }}
                  >
                    ₹{formatLargeNumber(totalRevenue)}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={2}>
              <Card
                style={{
                  borderLeft: "4px solid #2196F3",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Body>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Avg Revenue / Sale
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginTop: "8px",
                    }}
                  >
                    ₹{formatLargeNumber(avgRevenue)}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={2}>
              <Card
                style={{
                  borderLeft: "4px solid #f44336",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Body>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Top Performing Team
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginTop: "8px",
                    }}
                  >
                    {topTeam}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={2}>
              <Card
                style={{
                  borderLeft: "4px solid #4caf50",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Body>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Revenue Entries
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginTop: "8px",
                    }}
                  >
                    {totalSales}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </>
        ) : (
          /* MANAGER/EMPLOYEE KPI Cards */
          <>
            <Col md={2}>
              <Card
                style={{
                  borderLeft: "4px solid #ff9800",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Body>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    My Team Size
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "bold",
                      marginTop: "6px",
                    }}
                  >
                    Managers: {totalManagers}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "bold",
                      marginTop: "6px",
                    }}
                  >
                    Employees: {totalEmpCount}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={2}>
              <Card
                style={{
                  borderLeft: "4px solid #2196F3",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Body>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Product Revenue
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginTop: "8px",
                    }}
                  >
                    ₹{formatLargeNumber(totalRevenue)}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={2}>
              <Card
                style={{
                  borderLeft: "4px solid #2196F3",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Body>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Avg Revenue / Sale
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginTop: "8px",
                    }}
                  >
                    ₹{formatLargeNumber(avgRevenue)}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={2}>
              <Card
                style={{
                  borderLeft: "4px solid #433a99ff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Body>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Total Clients
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginTop: "8px",
                    }}
                  >
                    {totalClients}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={2}>
              <Card
                style={{
                  borderLeft: "4px solid #4caf50",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Body>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Monthly Growth
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginTop: "8px",
                      color: monthlyGrowth >= 0 ? "#4caf50" : "#f44336",
                    }}
                  >
                    {monthlyGrowth.toFixed(1)}%
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={2}>
              <Card
                style={{
                  borderLeft: "4px solid #9c27b0",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Card.Body>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Revenue Entries
                  </div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginTop: "8px",
                    }}
                  >
                    {totalSales}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}
      </Row>

      {/* Charts Row - ADMIN */}
      {isAdmin && (
        <Row>
          {/* Company Performance Overview */}
          <Col md={4}>
            <Card style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              <Card.Body>
                <h5 style={{ marginBottom: "20px" }}>
                  Company Performance Overview
                </h5>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={companyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={formatLargeNumber} />
                    <Tooltip formatter={(v) => "₹" + formatLargeNumber(v)} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#4caf50"
                      strokeWidth={2}
                      name="Sales"
                      dot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="#f44336"
                      strokeWidth={2}
                      name="Expenses"
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>

          {/* Product Sales Comparison */}
          <Col md={4}>
            <Card className="shadow-sm border-0 p-3">
              <h5 className="fw-semibold text-center mb-3">
                Product Sales Comparison
              </h5>
              {productComparisonChart.length > 1 ? (
                <Chart
                  chartType="BarChart"
                  width="100%"
                  height="350px"
                  data={productComparisonChart}
                  options={{
                    title: "Product Sales Comparison (Last Two Years)",
                    chartArea: { width: "60%" },
                    hAxis: { title: "Sales Count", minValue: 0 },
                    vAxis: { title: "Product" },
                    legend: { position: "bottom" },
                  }}
                />
              ) : (
                <div className="text-center mt-4">No Data Available</div>
              )}
            </Card>
          </Col>

          {/* Revenue Distribution by Product */}
          <Col md={4}>
            <Card className="shadow-sm border-0 p-3">
              <h5 className="fw-semibold text-center mb-3">
                Revenue Distribution by Product
              </h5>

              <div
                style={{
                  width: "100%",
                  minWidth: "280px",
                  height: "350px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <PieChart
                  width={260}
                  height={300}
                  series={[
                    {
                      data: revenuePieSeriesData,
                      // highlight behavior like docs
                      highlightScope: { fade: "global", highlight: "item" },
                      faded: {
                        innerRadius: 30,
                        additionalRadius: -30,
                        color: "gray",
                      },

                      // label on the arc: LIMS (30.4%)
                      arcLabel: (item) => {
                        const pct =
                          totalRevenueForPie > 0
                            ? ((item.value / totalRevenueForPie) * 100).toFixed(
                                1
                              )
                            : 0;
                        return `${item.label} (${pct}%)`;
                      },
                      arcLabelMinAngle: 10,
                      // use MUI formatter for hover tooltip
                      valueFormatter: pieValueFormatter,
                    },
                  ]}
                  slotProps={{
                    legend: {
                      direction: "column",
                      position: { vertical: "bottom", horizontal: "middle" },
                    },
                  }}
                  sx={{
                    // slice borders
                    "& .MuiPieArc-root": {
                      stroke: "#ffffff",
                      strokeWidth: 1,
                    },
                    // label text style
                    "& .MuiPieArcLabel-root": {
                      fill: "#ffffffff",
                      fontSize: 11,
                      fontWeight: 500,
                    },
                  }}
                />
              </div> 

            </Card>
          </Col>
        </Row>
      )}

      {/* Charts Row - MANAGER/EMPLOYEE */}
      {!isAdmin && (
        <Row>
          {/* Product Performance Timeline */}
          <Col md={4}>
            <Card style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              <Card.Body>
                <h5 style={{ marginBottom: "20px" }}>
                  Product Performance Timeline
                </h5>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={productPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tickFormatter={formatLargeNumber} />
                    <Tooltip
                      formatter={(v) => "₹" + formatLargeNumber(v)}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                      }}
                    />
                    <Legend />
                    {/* Revenue line - shown first in tooltip */}
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#4caf50"
                      strokeWidth={2}
                      name="Revenue"
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                    {/* Profit line - shown second in tooltip */}
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="#2196F3"
                      strokeWidth={2}
                      name="Profit"
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                    {/* Expenses line - shown third in tooltip */}
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="#f44336"
                      strokeWidth={2}
                      name="Expenses"
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>

          {/* Sales Comparison Across Years */}
          <Col md={4}>
            <Card style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              <Card.Body>
                <h5 style={{ marginBottom: "20px" }}>
                  Sales Comparison Across Years
                </h5>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={yearComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value} Sales`, "Total Sales"]}
                      labelStyle={{ fontWeight: "bold" }}
                    />
                    <Legend />
                    <Bar
                      dataKey="sales"
                      // fill="#49e277ff"
                      // fill="#42abe7ff"
                      fill="#7d77ebff"
                      name="Total Sales"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>

          {/* Top 5 Clients */}
          <Col md={4}>
            <Card style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              <Card.Body>
                <h5 style={{ marginBottom: "20px" }}>
                  Top 5 Clients by Revenue
                </h5>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={topClients}
                    layout="vertical"
                    margin={{ left: 20, right: 80 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={formatLargeNumber} />
                    <YAxis
                      type="category"
                      dataKey="client"
                      width={150}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(v) => "₹" + formatLargeNumber(v)}
                      labelStyle={{ fontSize: 12 }}
                    />
                    <Bar dataKey="total_revenue" fill="#8884d8" name="Revenue">
                      {topClients.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default Dashboard;
