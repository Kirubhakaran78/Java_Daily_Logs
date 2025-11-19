import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col } from "react-bootstrap";
import { LineChart, Line, BarChart, Bar, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";
import { Chart } from "react-google-charts";
import { PieChart } from "@mui/x-charts/PieChart";
import './Dashboard.css';

// Format numbers as currency
function formatCurrency(val) {
  if (val === null || val === undefined || val === "") return "₹0";
  const n = Number(val);
  if (Number.isNaN(n)) return val;
  return "₹" + n.toLocaleString();
}

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("currentUser") || "{}")
  );

  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyPerformance, setCompanyPerformance] = useState([]);
  const [roleDistribution, setRoleDistribution] = useState([]);
  const [rolePieChartData, setRolePieChartData] = useState([]);

  const [productComparison, setProductComparison] = useState([]);

  useEffect(() => {
    const fetchProductComparison = async () => {
      try {
        const res = await axios.get("http://localhost:8082/api/masters/getProductComparison");
        setProductComparison(res.data || []);
      } catch (error) {
        console.error("Error fetching product comparison:", error);
      }
    };
    fetchProductComparison();
  }, []);



  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser?.username) {
          const userRes = await axios.get(
            `http://localhost:8082/api/users/currentUser?username=${currentUser.username}`
          );
          sessionStorage.setItem("currentUser", JSON.stringify(userRes.data));
          setCurrentUser(userRes.data);
        }


        const [empRes, prodRes, revRes, perfRes] = await Promise.all([
          axios.get("http://localhost:8082/api/masters/getAllEmp"),
          axios.get("http://localhost:8082/api/masters/getAllProduct"),
          axios.get("http://localhost:8082/api/masters/getAllRevenue"),
          axios.get("http://localhost:8082/api/masters/getCompanyPerformance"),
        ]);

        setEmployees(empRes.data || []);
        setProducts(prodRes.data || []);
        setRevenues(revRes.data || []);

        // SAFE conversion for company performance
        let perfData = perfRes.data;

        // If backend wraps the data
        if (perfData?.data) perfData = perfData.data;

        // Ensure array
        if (!Array.isArray(perfData)) perfData = [];

        const converted = perfData.map(item => ({
          year: Number(item.year) || item.year?.toString() || "Unknown",
          sales: Number(item.sales) || 0,
          expenses: Number(item.expenses) || (Number(item.sales) * 0.1) || 0,
        }));

        setCompanyPerformance(converted);
        console.log("Company performance data:", converted);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser?.username]);

  useEffect(() => {
    const fetchRoleDistribution = async () => {
      try {
        const res = await axios.get("http://localhost:8082/api/masters/getRoleDistribution");
        setRoleDistribution(res.data || []);
      } catch (error) {
        console.error("Error fetching role distribution:", error);
      }
    };

    fetchRoleDistribution();
  }, []);

  // Fetch from backend
  const fetchRoleData = async () => {
    try {
      const response = await axios.get("http://localhost:8082/api/masters/roles");
      setRolePieChartData(response.data);
    } catch (error) {
      console.error("Error fetching role data:", error);
    }
  };

  useEffect(() => {
    fetchRoleData();
  }, []);



  // Role-based filtering
  const isAdmin = currentUser?.role?.toUpperCase() === "ADMIN";

  const canSeeAll = ["ADMIN", "MANAGER", "EMPLOYEE"].includes(
    currentUser?.role?.toUpperCase()
  );


  const userProduct = currentUser?.product_name?.trim().toLowerCase();

  //role base restrictions
  const filteredEmployees = employees.filter((emp) => {
    if (isAdmin) return true;
    return emp.product_name?.trim().toLowerCase() === userProduct;
  });

  // const filteredEmployees = canSeeAll ? employees : [];


  const filteredProducts = products.filter((prod) => {
    if (isAdmin) return true;
    return prod.product_name?.trim().toLowerCase() === userProduct;
  });

  //const filteredProducts = canSeeAll ? products  : [];


  const filteredRevenues = revenues.filter((rev) => {
    if (isAdmin) return true;
    return rev.product_name?.trim().toLowerCase() === userProduct;
  });

  //const filteredRevenues = canSeeAll ? revenues  : [];

  // Calculate KPIs
  const totalRevenue = filteredRevenues.reduce((sum, r) => sum + (parseFloat(r.revenue_amount) || 0), 0);
  const totalSales = filteredRevenues.length;
  const totalClients = new Set(filteredRevenues.map(r => r.client_name)).size;
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
  filteredRevenues.forEach(r => {
    const product = r.product_name || "Unknown";
    productRevenues[product] = (productRevenues[product] || 0) + (parseFloat(r.revenue_amount) || 0);
  });
  const topTeam = Object.entries(productRevenues).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  // Monthly Revenue Trend
  const monthlyData = {};
  filteredRevenues.forEach(r => {
    const month = r.month_year || "Unknown";
    monthlyData[month] = (monthlyData[month] || 0) + (parseFloat(r.revenue_amount) || 0);
  });
  const monthlyTrend = Object.entries(monthlyData).map(([month, revenue]) => ({
    month,
    revenue
  }));

  // Product Progress (by count)
  const productCount = {};
  filteredRevenues.forEach(r => {
    const product = r.product_name || "Unknown";
    productCount[product] = (productCount[product] || 0) + 1;
  });
  const productProgress = Object.entries(productCount).map(([name, value]) => ({
    name,
    value
  }));

  //product comparison data
  // Convert backend response into chart-ready format
  const productComparisonChart = React.useMemo(() => {
    if (!productComparison.length) return [["Product", "This Year", "Last Year"]];

    // Extract latest 2 years dynamically
    const years = [...new Set(productComparison.map(item => item.year))].sort().reverse();
    const [year1, year2] = years; // example: 2024, 2023

    const grouped = {};

    productComparison.forEach(item => {
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
        val[year2] || 0
      ])
    ];
  }, [productComparison]);

  //Compare for the product based with the year and the sales count
  //  const salesComparisonChartForEmp = React.useMemo(() => {
  //   if (!salesComparisonChartForEmp.length) return [["Product", "This Year", "Last Year"]];

  //   // Extract latest 2 years dynamically
  //   const years = [...new Set(salesComparisonChartForEmp.map(item => item.year))].sort().reverse();
  //   const [year1, year2] = years; // example: 2024, 2023

  //   const grouped = {};

  //   salesComparisonChartForEmp.forEach(item => {
  //     if (!grouped[item.product]) {
  //       grouped[item.product] = { [year1]: 0, [year2]: 0 };
  //     }
  //     grouped[item.product][item.year] = item.count;
  //   });
  //   return [
  //     ["Product", String(year1), String(year2)],
  //     ...Object.entries(grouped).map(([product, val]) => [
  //       product,
  //       val[year1] || 0,
  //       val[year2] || 0
  //     ])
  //   ];
  // }, [productComparison]);


  const productComparisonOptions = {
    title: "Product Sales Comparison (Last Two Years)",
    chartArea: { width: "60%" },
    hAxis: {
      title: "Sales Count",
      minValue: 0,
    },
    vAxis: {
      title: "Product",
    },
    legend: { position: "bottom" },
  };


  // Employee Role Distribution
  const roleCount = {};
  filteredEmployees.forEach(e => {
    const role = e.emp_role || "Unknown";
    roleCount[role] = (roleCount[role] || 0) + 1;
  });
  const roleChartData = Object.entries(roleCount).map(([role, count]) => ({
    role,
    count
  }));
  const COLORS = ["#1976d2", "#4caf50", "#ff9800", "#f44336", "#9c27b0"];

  const roleRadicalChartData = Object.entries(roleCount).map(([role, count], i) => ({
    role,
    count: Number(count),
    fill: COLORS[i % COLORS.length],
    name: role,
  }));


  if (loading) {
    return <div className="text-center mt-5"><h4>Loading dashboard...</h4></div>;
  }




  const allowedRoles = ["ADMIN", "MANAGER", "EMPLOYEE"];
  if (!allowedRoles.includes(currentUser?.role?.toUpperCase())) {
    return (
      <div className="text-center mt-5">
        <h4>You need access to view this page.</h4>
      </div>
    );
  }

  // Transform performance data for Google Chart
  const performanceChartData = [
    ["Year", "Sales", "Expenses"],
    ...companyPerformance.map(item => [
      item.year,
      Number(item.sales) || 0,
      Number(item.expenses) || 0,
    ]),
  ];

  const chartData = [
    ["Year", "Sales", "Expenses"],
    ...companyPerformance.map(item => {
      const expenses = item.expenses || item.sales * 0.1; // assume 10% of sales if missing
      return [String(item.year), Number(item.sales), Number(expenses)];
    })
  ];


  const performanceChartOptions = {
    title: "Company Performance Overview",
    seriesType: "bars",
    series: { 1: { type: "line" } },
    legend: { position: "bottom" },
    colors: ["#4caf50", "#f44336"],
  };


  const EmployeeRoleDistribution = ({ data }) => {
    // Example fallback data (you can replace with API data)
    const roleData = data || [
      { role: "Admin", count: 3, fill: "#1976d2" },
      { role: "Manager", count: 7, fill: "#4caf50" },
      { role: "Employee", count: 15, fill: "#ff9800" },
    ];
  }

  const ProductProgressStatus = ({ data }) => {
    // Example fallback data — replace with your actual API data
    const productData = data || [
      { name: "Product A", progress: 85 },
      { name: "Product B", progress: 72 },
      { name: "Product C", progress: 60 },
      { name: "Product D", progress: 45 },
    ];
  }


  // Yearly Revenue Calculation
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  let thisYearRevenue = 0;
  let lastYearRevenue = 0;

  filteredRevenues.forEach(r => {
    const amount = parseFloat(r.revenue_amount) || 0;
    const year = Number(String(r.month_year).split("-")[1]); // Extract Year from MM-YYYY

    if (year === currentYear) {
      thisYearRevenue += amount;
    } else if (year === lastYear) {
      lastYearRevenue += amount;
    }
  });


  // Profit Percentage Comparison

  let profitPercentage = 0;

  if (lastYearRevenue > 0) {
    profitPercentage = ((thisYearRevenue - lastYearRevenue) / lastYearRevenue) * 100;
  }

  //format large numbers
  const formatLargeNumber = (num) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };


  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <h2 className="mb-4">Dashboard</h2>

      {/* KPI Cards */}
      <Row className="mb-4">


        {/* {isAdmin && <Col md={2}>
          <Card style={{ borderLeft: "4px solid #ff9800", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <Card.Body>
              <div style={{ fontSize: "12px", color: "#666" }}>Total Employees</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "8px" }}>
                {totalEmployees}
              </div>
            </Card.Body>
          </Card>
        </Col>} */}

        {!isAdmin ? (
          <Col md={2}>
            <Card style={{ borderLeft: "4px solid #ff9800", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              <Card.Body>
                <div style={{ fontSize: "12px", color: "#666" }}>Managers & Employees </div>

                <div style={{ fontSize: "13px", fontWeight: "bold", marginTop: "6px" }}>

                  Managers: {totalManagers}
                </div>
                <div style={{ fontSize: "13px", fontWeight: "bold", marginTop: "6px" }}>
                  Employees: {totalEmpCount}

                </div>



                {/* <div style={{ fontSize: "12px", fontWeight: "bold", marginTop: "8px" }}>
                  Total : {totalEmployees}
                </div> */}
              </Card.Body>
            </Card>
          </Col>
        ) : (
          <Col md={2}>
            <Card style={{ borderLeft: "4px solid #ff9800", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              <Card.Body>
                <div style={{ fontSize: "12px", color: "#666" }}>Total Employees</div>
                <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "8px" }}>
                  {totalEmployees}
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}


        {isAdmin && <Col md={2}>
          <Card style={{ borderLeft: "4px solid #9c27b0", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <Card.Body>
              <div style={{ fontSize: "12px", color: "#666" }}>Teams</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "8px" }}>
                {totalTeams}
              </div>
            </Card.Body>
          </Card>
        </Col>}

        <Col md={2}>
          <Card style={{ borderLeft: "4px solid #2196F3", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <Card.Body>
              <div style={{ fontSize: "12px", color: "#666" }}>Total Revenue</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "8px" }}>
                {formatLargeNumber(totalRevenue)}
              </div>
            </Card.Body>
          </Card>
        </Col>



        <Col md={2}>
          <Card style={{ borderLeft: "4px solid #2196F3", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <Card.Body>
              <div style={{ fontSize: "12px", color: "#666" }}>Avg Revenue / Sale</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "8px" }}>
                {formatLargeNumber(avgRevenue)}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {isAdmin && <Col md={2}>
          <Card style={{ borderLeft: "4px solid #f44336", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <Card.Body>
              <div style={{ fontSize: "12px", color: "#666" }}>Top Performing Team</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "8px" }}>
                {topTeam}
              </div>
            </Card.Body>
          </Card>
        </Col>}


        <Col md={2}>
          <Card style={{ borderLeft: "4px solid #4caf50", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <Card.Body>
              <div style={{ fontSize: "12px", color: "#666" }}>Revenue Entries</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "8px" }}>
                {totalSales}
              </div>
            </Card.Body>
          </Card>
        </Col>


        {!isAdmin && (<Col md={2}>
          <Card style={{ borderLeft: "4px solid #433a99ff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <Card.Body>
              <div style={{ fontSize: "12px", color: "#666" }}>Total Client</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "8px" }}>
                {totalClients}
              </div>
            </Card.Body>
          </Card>
        </Col>)}



        {/* Last year this year comparison */}
        {/* <Col md={2}>
          <Card style={{ borderLeft: "4px solid #673ab7", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <Card.Body>
              <div style={{ fontSize: "12px", color: "#666" }}>
                Profit Change ({lastYear} → {currentYear})
              </div>

              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginTop: "8px",
                  color: profitPercentage >= 0 ? "#4caf50" : "#f44336"
                }}
              >
                {profitPercentage.toFixed(2)}%
              </div>

              <div style={{ fontSize: "12px", marginTop: "5px", color: "#777" }}>
                LY: {formatCurrency(lastYearRevenue)} <br />
                TY: {formatCurrency(thisYearRevenue)}
              </div>
            </Card.Body>
          </Card>
        </Col> */}
      </Row>

      {/* Charts Row */}
      <Row>

        {/* Company Performance Overview */}
        <Col md={4}>
          <Card style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <Card.Body>
              <h5 style={{ marginBottom: "20px" }}>Company Performance Overview</h5>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={companyPerformance || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="year" />
                  {/* FORMAT LARGE NUMBERS */}
                  <YAxis tickFormatter={formatLargeNumber} />

                  {/* CUSTOM TOOLTIP */}
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
            <h5 className="fw-semibold text-center mb-3">Product Sales Comparison</h5>

            {productComparisonChart.length > 1 ? (
              <Chart
                chartType="BarChart"
                width="100%"
                height="405px"
                data={productComparisonChart}
                options={productComparisonOptions}
              />
            ) : (
              <div className="text-center mt-4">No Data Available</div>
            )}
          </Card>
        </Col>



        {/* Employee role distribution - original */}
        <Col md={4}>
          <Card className="shadow-sm border-0 p-3">
            <h5 className="fw-semibold text-center mb-3">Employee Role Distribution</h5>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <PieChart
                series={[
                  {
                    data: roleChartData.map((r, i) => ({
                      id: i,
                      value: r.count,
                      label: r.role,
                      color: COLORS[i % COLORS.length],
                    })),
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    valueFormatter: (v) => `${v.value} Employees`,
                  },
                ]}
                height={370}
                width={250}
                slotProps={{
                  legend: {
                    direction: 'column',
                    position: { vertical: 'middle', horizontal: 'right' },
                  },
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
