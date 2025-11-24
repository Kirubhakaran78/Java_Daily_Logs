//package com.example.demo.repo.employee;
//
//import java.util.List;
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.stereotype.Repository;
//
//@Repository
//public class EmployeeDaoImpl implements EmployeeDao {
//
//    @Autowired
//    private JdbcTemplate jdbcTemplate;
//
//    @Override
//    public Map<String, Object> save(Map<String, Object> jsonData) {
//        String emp_name = (String) jsonData.getOrDefault("emp_name", "John");
//        String emp_email = (String) jsonData.getOrDefault("emp_email", "john@example.com");
//
//        Integer product_id = null;
//        if (jsonData.containsKey("product_id") && jsonData.get("product_id") != null) {
//            String val = jsonData.get("product_id").toString();
//            if (!val.isEmpty() && !val.equals("null")) {
//                product_id = Integer.parseInt(val);
//            }
//        }
//
//        String emp_role = (String) jsonData.getOrDefault("emp_role", "EMPLOYEE");
//        String site = (String) jsonData.getOrDefault("site", "Chennai");
//
//        Object isActiveObj = jsonData.getOrDefault("is_active", false);
//        boolean is_active = (isActiveObj instanceof Boolean)
//                ? (Boolean) isActiveObj
//                : Boolean.parseBoolean(isActiveObj.toString());
//
//        String dateStr = (String) jsonData.getOrDefault("date_of_joining", "2025-01-01");
//        java.sql.Date date_of_joining = java.sql.Date.valueOf(dateStr);
//
//        String status = is_active ? "ACTIVE" : "IN_PROGRESS";
//
//        String sql = "INSERT INTO employee " +
//                "(emp_name, emp_email, product_id, emp_role, site, is_active, status, date_of_joining) " +
//                "VALUES ('"+emp_name+"', '"+emp_email+"', '"+product_id+"', '"+emp_role+"', '"+site+"', '"+is_active+"', '"+status+"', '"+date_of_joining+"')";
//        
////        jdbcTemplate.update(sql, emp_name, emp_email, product_id, emp_role,
////                site, is_active, status, date_of_joining);
//        
//        jdbcTemplate.update(sql);
//
//        // Fetch the inserted employee
//        String fetchSql = "SELECT * FROM employee ORDER BY id DESC LIMIT 1";
//        Map<String, Object> saved = jdbcTemplate.queryForMap(fetchSql);
//
//        Integer employeeId = (Integer) saved.get("id");
//
//        // Get product_name for login table
//        String product_name = null;
//        if (product_id != null) {
//            product_name = jdbcTemplate.queryForObject(
//                    "SELECT product_name FROM product WHERE id = '"+product_id+"'",
//                    String.class                   
//            );
//        }
//
//        // Insert into login table
//        String loginSql = "INSERT INTO loginTable (username, password, role, product_name) VALUES ('"+emp_name+"', '"+1234+"', '"+emp_role+"','"+product_name+"' )";
////        jdbcTemplate.update(loginSql, emp_name, "1234", emp_role, product_name);
//        jdbcTemplate.update(loginSql);
//
//        return saved;       
//    }
//    
//    @Override
//    public void update(Map<String, Object> jsonData) {
//        int id = (int) jsonData.get("id");
//        String emp_id = (String) jsonData.get("emp_id");
//        String emp_name = (String) jsonData.get("emp_name");
//        String emp_email = (String) jsonData.get("emp_email");
//
//     // GET OLD NAME BEFORE UPDATING
//        String oldName = jdbcTemplate.queryForObject(
//                "SELECT emp_name FROM employee WHERE id = '"+id+"'",
//                String.class                
//        );
//     
//
//        Integer product_id = null;
//        if (jsonData.containsKey("product_id") && jsonData.get("product_id") != null) {
//            String val = jsonData.get("product_id").toString();
//            if (!val.isEmpty() && !val.equals("null")) {
//                product_id = Integer.parseInt(val);
//            }
//        }
//
//        String emp_role = (String) jsonData.get("emp_role");
//        String site = (String) jsonData.get("site");
//
//        Object isActiveObj = jsonData.get("is_active");
//        boolean is_active = (isActiveObj instanceof Boolean)
//                ? (Boolean) isActiveObj
//                : Boolean.parseBoolean(isActiveObj.toString());
//
//        String dateStr = (String) jsonData.get("date_of_joining");
//        java.sql.Date date_of_joining = java.sql.Date.valueOf(dateStr);
//
//        String oldStatus = jdbcTemplate.queryForObject(
//                "SELECT status FROM employee WHERE id = '"+id+"'",
//                String.class
//                
//        );
//
//        String status;
//        if (is_active) {
//            status = "ACTIVE";
//        } else {
//            if ("ACTIVE".equalsIgnoreCase(oldStatus)) {
//                status = "INACTIVE";
//            } else {
//                status = "IN_PROGRESS";
//            }
//        }
//
//        // UPDATE EMPLOYEE
//        String updateEmpSql =
//                "UPDATE employee SET emp_id='"+emp_id+"', emp_name='"+emp_name+"', emp_email='"+emp_email+"', product_id='"+product_id+"'," +
//                        " emp_role='"+emp_role+"', site='"+site+"', is_active='"+is_active+"', status='"+status+"', date_of_joining='"+date_of_joining+"' WHERE id='"+id+"'";
//
////        jdbcTemplate.update(updateEmpSql,
////                emp_id, emp_name, emp_email, product_id,
////                emp_role, site, is_active, status, date_of_joining, id);
//        jdbcTemplate.update(updateEmpSql);
//
//        // GET PRODUCT NAME
//        String product_name = null;
//        if (product_id != null) {
//            product_name = jdbcTemplate.queryForObject(
//                    "SELECT product_name FROM product WHERE id = '"+product_id+"'",
//                    String.class                    
//            );
//        }
//
////        // UPDATE LOGIN TABLE USING OLD EMAIL
////        String updateLoginSql = "UPDATE loginTable SET role=?, product_name=?, username=? WHERE username=?";
////        jdbcTemplate.update(updateLoginSql, emp_role, product_name, emp_email, oldEmail);
//        
//        
//        // UPDATE LOGIN TABLE USING OLD NAME
//           String updateLoginSql = "UPDATE loginTable SET role='"+emp_role+"', product_name='"+product_name+"', username='"+emp_name+"' WHERE username='"+oldName+"'";
//           //jdbcTemplate.update(updateLoginSql, emp_role, product_name, emp_name, oldName);
//           jdbcTemplate.update(updateLoginSql);
//    }    //   '"++"'
//
////    @Override
////    public void update(Map<String, Object> jsonData) {
////        int id = (int) jsonData.get("id");
////        String emp_id = (String) jsonData.get("emp_id");
////        String emp_name = (String) jsonData.get("emp_name");
////        String emp_email = (String) jsonData.get("emp_email");
////
////        Integer product_id = null;
////        if (jsonData.containsKey("product_id") && jsonData.get("product_id") != null) {
////            String val = jsonData.get("product_id").toString();
////            if (!val.isEmpty() && !val.equals("null")) {
////                product_id = Integer.parseInt(val);
////            }
////        }
////
////        String emp_role = (String) jsonData.get("emp_role");
////        String site = (String) jsonData.get("site");
////
////        Object isActiveObj = jsonData.get("is_active");
////        boolean is_active = (isActiveObj instanceof Boolean)
////                ? (Boolean) isActiveObj
////                : Boolean.parseBoolean(isActiveObj.toString());
////
////        String dateStr = (String) jsonData.get("date_of_joining");
////        java.sql.Date date_of_joining = java.sql.Date.valueOf(dateStr);
////
////        String oldStatus = jdbcTemplate.queryForObject(
////                "SELECT status FROM employee WHERE id = ?",
////                String.class,
////                id
////        );
////
////        String status;
////        if (is_active) {
////            status = "ACTIVE";
////        } else {
////            if ("ACTIVE".equalsIgnoreCase(oldStatus)) {
////                status = "INACTIVE";
////            } else {
////                status = "IN_PROGRESS";
////            }
////        }
////
////        String updateEmpSql =
////                "UPDATE employee SET emp_id=?, emp_name=?, emp_email=?, product_id=?," +
////                        " emp_role=?, site=?, is_active=?, status=?, date_of_joining=? WHERE id=?";
////
////        jdbcTemplate.update(updateEmpSql,
////                emp_id, emp_name, emp_email, product_id,
////                emp_role, site, is_active, status, date_of_joining, id);
////
////        String product_name = null;
////        if (product_id != null) {
////            product_name = jdbcTemplate.queryForObject(
////                    "SELECT product_name FROM product WHERE id = ?",
////                    String.class,
////                    product_id
////            );
////        }
////
//////        String updateLoginSql = "UPDATE loginTable SET role=?, product_name=? WHERE username=?";
//////        jdbcTemplate.update(updateLoginSql, emp_role, product_name, emp_name);
////        
////     // Update login table - use emp_email as username
////        String updateLoginSql = "UPDATE loginTable SET role=?, product_name=?, username=? WHERE username=?";
////        jdbcTemplate.update(updateLoginSql, emp_role, product_name, emp_email, emp_name);
////    }
//
//    @Override
//    public List<Map<String, Object>> findAll() {
//        String fetchSql = """
//                SELECT 
//                    e.id,
//                    e.emp_id,
//                    e.emp_name,
//                    e.emp_email,
//                    e.product_id,
//                    p.product_name,
//                    e.emp_role,
//                    e.site,
//                    e.date_of_joining,
//                    e.is_active,
//                    e.status,
//                    CASE
//                        WHEN e.is_active = false AND e.status = 'IN_PROGRESS' THEN 'IN_PROGRESS'
//                        WHEN e.is_active = true THEN 'ACTIVE'
//                        WHEN e.is_active = false THEN 'INACTIVE'
//                    END AS status_display
//                FROM employee e
//                LEFT JOIN product p ON e.product_id = p.id
//                ORDER BY e.id
//                """;
//
//        return jdbcTemplate.queryForList(fetchSql);
//    }
//
//
//    @Override
//    public void delete(int id) {
//        // Get employee details
//        Map<String, Object> emp = jdbcTemplate.queryForMap(
//                "SELECT emp_name, emp_email FROM employee WHERE id='"+id+"'");
//        
//        String empName = (String) emp.get("emp_name");
//        String empEmail = (String) emp.get("emp_email");
//
//        // Delete from both tables
//        jdbcTemplate.update("DELETE FROM employee WHERE id='"+id+"'");
//        
//        // Delete from login using either username or email
//        jdbcTemplate.update("DELETE FROM loginTable WHERE username='"+empName+"'");
//    }
//
//    @Override
//    public void saveFromLogin(String username) {
//        String sql = "INSERT INTO employee (emp_name, emp_role, is_active, status) " +
//                "VALUES (?,?,?,?)";
//        
////        jdbcTemplate.update(sql);
//        jdbcTemplate.update(sql, username, "EMPLOYEE", false, "IN_PROGRESS");
//    }
//
//    @Override
//    public Map<String, Object> findByEmail(String empEmail) {
//        String sql = "SELECT * FROM employee WHERE emp_email = '"+empEmail+"'";
//        return jdbcTemplate.queryForMap(sql);
//    }
//
//    @Override
//    public Map<String, Object> findById(int id) {
//        return jdbcTemplate.queryForMap("SELECT * FROM employee WHERE id = '"+id+"'");
//    }
//
//    @Override
//    public List<Map<String, Object>> getRoleDistribution() {
//        return jdbcTemplate.queryForList(
//                "SELECT emp_role AS role, COUNT(*) AS count FROM employee GROUP BY emp_role"
//        );
//    }
//
//    @Override
//    public List<Map<String, Object>> getRevenueByProduct() {
//        String sql = """
//                SELECT p.product_name as product,
//                       SUM(r.revenue_amount) as total_revenue
//                FROM revenue r
//                JOIN product p ON r.product_id = p.id
//                GROUP BY p.product_name
//                ORDER BY total_revenue DESC
//                """;
//        return jdbcTemplate.queryForList(sql);
//    }
//
//    @Override
//    public List<Map<String, Object>> getProductPerformance(String productName) {
//        String sql = """
//                SELECT TO_CHAR(r.month_year, 'Mon YYYY') as month,
//                       r.month_year as date,
//                       SUM(r.revenue_amount) as revenue,
//                       SUM(r.expense_amount) as expenses,
//                       SUM(r.profit) as profit
//                FROM revenue r
//                JOIN product p ON r.product_id = p.id
//                WHERE p.product_name = ?
//                GROUP BY r.month_year
//                ORDER BY r.month_year
//                """;
//        return jdbcTemplate.queryForList(sql, productName);
//    }
//
//    @Override
//    public List<Map<String, Object>> getYearComparison(String productName) {
//        String sql = """
//                SELECT EXTRACT(YEAR FROM r.month_year) as year,
//                       COUNT(*) as sales
//                FROM revenue r
//                JOIN product p ON r.product_id = p.id
//                WHERE p.product_name = ?
//                GROUP BY EXTRACT(YEAR FROM r.month_year)
//                ORDER BY year
//                """;
//        return jdbcTemplate.queryForList(sql, productName);
//    }
//
//    @Override
//    public List<Map<String, Object>> getTopClients(String productName) {
//        String sql = """
//                SELECT r.client_name as client,
//                       SUM(r.revenue_amount) as total_revenue,
//                       COUNT(*) as transaction_count
//                FROM revenue r
//                JOIN product p ON r.product_id = p.id
//                WHERE p.product_name = ?
//                  AND r.client_name IS NOT NULL
//                GROUP BY r.client_name
//                ORDER BY total_revenue DESC
//                LIMIT 5
//                """;
//        return jdbcTemplate.queryForList(sql, productName);
//    }
//
//    @Override
//    public Map<String, Object> getMonthlyGrowth(String productName) {
//        String sql = """
//                WITH monthly_revenue AS (
//                    SELECT r.month_year,
//                           SUM(r.revenue_amount) as revenue
//                    FROM revenue r
//                    JOIN product p ON r.product_id = p.id
//                    WHERE p.product_name = ?
//                    GROUP BY r.month_year
//                    ORDER BY r.month_year DESC
//                    LIMIT 2
//                )
//                SELECT 
//                    (SELECT revenue FROM monthly_revenue ORDER BY month_year DESC LIMIT 1) as current_month,
//                    (SELECT revenue FROM monthly_revenue ORDER BY month_year ASC LIMIT 1) as previous_month
//                """;
//
//        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql, productName);
//
//        if (list.isEmpty()) return Map.of("growthPercentage", 0);
//
//        Map<String, Object> row = list.get(0);
//
//        double current = row.get("current_month") != null
//                ? ((Number) row.get("current_month")).doubleValue()
//                : 0;
//
//        double previous = row.get("previous_month") != null
//                ? ((Number) row.get("previous_month")).doubleValue()
//                : 0;
//
//        double growth = previous > 0 ? ((current - previous) / previous) * 100 : 0;
//
//        return Map.of(
//                "currentMonth", current,
//                "previousMonth", previous,
//                "growthPercentage", growth
//        );
//    }
//
//    @Override
//    public List<Map<String, Object>> getMonthlySalesDistribution(String productName) {
//        String sql = """
//                SELECT TO_CHAR(r.month_year, 'Mon') as month,
//                       EXTRACT(MONTH FROM r.month_year) as month_num,
//                       COUNT(*) as sales_count,
//                       SUM(r.revenue_amount) as total_revenue
//                FROM revenue r
//                JOIN product p ON r.product_id = p.id
//                WHERE p.product_name = ?
//                  AND EXTRACT(YEAR FROM r.month_year) = EXTRACT(YEAR FROM CURRENT_DATE)
//                GROUP BY TO_CHAR(r.month_year, 'Mon'), EXTRACT(MONTH FROM r.month_year)
//                ORDER BY month_num
//                """;
//        return jdbcTemplate.queryForList(sql, productName);
//    }
//
//    @Override
//    public List<Map<String, Object>> getCompanyMonthlySales() {
//        String sql = """
//                SELECT TO_CHAR(r.month_year, 'Mon') as month,
//                       EXTRACT(MONTH FROM r.month_year) as month_num,
//                       COUNT(*) as sales_count,
//                       SUM(r.revenue_amount) as total_revenue
//                FROM revenue r
//                WHERE EXTRACT(YEAR FROM r.month_year) = EXTRACT(YEAR FROM CURRENT_DATE)
//                GROUP BY TO_CHAR(r.month_year, 'Mon'), EXTRACT(MONTH FROM r.month_year)
//                ORDER BY month_num
//                """;
//        return jdbcTemplate.queryForList(sql);
//    }
//}



package com.example.demo.repo.employee;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class EmployeeDaoImpl implements EmployeeDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public Map<String, Object> save(Map<String, Object> jsonData) {
        String emp_name = (String) jsonData.getOrDefault("emp_name", "John");
        String emp_email = (String) jsonData.getOrDefault("emp_email", "john@example.com");

        Integer product_id = null;
        if (jsonData.containsKey("product_id") && jsonData.get("product_id") != null) {
            String val = jsonData.get("product_id").toString();
            if (!val.isEmpty() && !val.equals("null")) {
                product_id = Integer.parseInt(val);
            }
        }

        String emp_role = (String) jsonData.getOrDefault("emp_role", "EMPLOYEE");
        String site = (String) jsonData.getOrDefault("site", "Chennai");

        Object isActiveObj = jsonData.getOrDefault("is_active", false);
        boolean is_active = (isActiveObj instanceof Boolean)
                ? (Boolean) isActiveObj
                : Boolean.parseBoolean(isActiveObj.toString());

        String dateStr = (String) jsonData.getOrDefault("date_of_joining", "2025-01-01");
        java.sql.Date date_of_joining = java.sql.Date.valueOf(dateStr);

        String status = is_active ? "ACTIVE" : "IN_PROGRESS";

        String sql = "INSERT INTO employee " +
                "(emp_name, emp_email, product_id, emp_role, site, is_active, status, date_of_joining) " +
                "VALUES ('" + emp_name + "', '" + emp_email + "', '" + product_id + "', '" + emp_role + "', '" + site + "', '" + is_active + "', '" + status + "', '" + date_of_joining + "')";

        jdbcTemplate.update(sql);

        // Fetch the inserted employee
        String fetchSql = "SELECT * FROM employee ORDER BY id DESC LIMIT 1";
        Map<String, Object> saved = jdbcTemplate.queryForMap(fetchSql);

        Integer employeeId = (Integer) saved.get("id");

        // Get product_name for login table
        String product_name = null;
        if (product_id != null) {
            product_name = jdbcTemplate.queryForObject(
                    "SELECT product_name FROM product WHERE id = '" + product_id + "'",
                    String.class
            );
        }

        // Insert into login table
        String loginSql = "INSERT INTO loginTable (username, password, role, product_name) " +
                "VALUES ('" + emp_name + "', '" + 1234 + "', '" + emp_role + "','" + product_name + "' )";
        jdbcTemplate.update(loginSql);

        return saved;
    }

    @Override
    public void update(Map<String, Object> jsonData) {
        int id = (int) jsonData.get("id");
        String emp_id = (String) jsonData.get("emp_id");
        String emp_name = (String) jsonData.get("emp_name");
        String emp_email = (String) jsonData.get("emp_email");

        // GET OLD NAME BEFORE UPDATING
        String oldName = jdbcTemplate.queryForObject(
                "SELECT emp_name FROM employee WHERE id = '" + id + "'",
                String.class
        );

        Integer product_id = null;
        if (jsonData.containsKey("product_id") && jsonData.get("product_id") != null) {
            String val = jsonData.get("product_id").toString();
            if (!val.isEmpty() && !val.equals("null")) {
                product_id = Integer.parseInt(val);
            }
        }

        String emp_role = (String) jsonData.get("emp_role");
        String site = (String) jsonData.get("site");

        Object isActiveObj = jsonData.get("is_active");
        boolean is_active = (isActiveObj instanceof Boolean)
                ? (Boolean) isActiveObj
                : Boolean.parseBoolean(isActiveObj.toString());

        String dateStr = (String) jsonData.get("date_of_joining");
        java.sql.Date date_of_joining = java.sql.Date.valueOf(dateStr);

        String oldStatus = jdbcTemplate.queryForObject(
                "SELECT status FROM employee WHERE id = '" + id + "'",
                String.class
        );

        String status;
        if (is_active) {
            status = "ACTIVE";
        } else {
            if ("ACTIVE".equalsIgnoreCase(oldStatus)) {
                status = "INACTIVE";
            } else {
                status = "IN_PROGRESS";
            }
        }

        // UPDATE EMPLOYEE
        String updateEmpSql =
                "UPDATE employee SET emp_id='" + emp_id + "', emp_name='" + emp_name + "', emp_email='" + emp_email + "', product_id='" + product_id + "'," +
                        " emp_role='" + emp_role + "', site='" + site + "', is_active='" + is_active + "', status='" + status + "', date_of_joining='" + date_of_joining + "' WHERE id='" + id + "'";

        jdbcTemplate.update(updateEmpSql);

        // GET PRODUCT NAME
        String product_name = null;
        if (product_id != null) {
            product_name = jdbcTemplate.queryForObject(
                    "SELECT product_name FROM product WHERE id = '" + product_id + "'",
                    String.class
            );
        }

        // UPDATE LOGIN TABLE USING OLD NAME
        String updateLoginSql = "UPDATE loginTable SET role='" + emp_role + "', product_name='" + product_name + "', username='" + emp_name + "' WHERE username='" + oldName + "'";
        jdbcTemplate.update(updateLoginSql);
    }

    @Override
    public List<Map<String, Object>> findAll() {
        String fetchSql = """
                SELECT 
                    e.id,
                    e.emp_id,
                    e.emp_name,
                    e.emp_email,
                    e.product_id,
                    p.product_name,
                    e.emp_role,
                    e.site,
                    e.date_of_joining,
                    e.is_active,
                    e.status,
                    CASE
                        WHEN e.is_active = false AND e.status = 'IN_PROGRESS' THEN 'IN_PROGRESS'
                        WHEN e.is_active = true THEN 'ACTIVE'
                        WHEN e.is_active = false THEN 'INACTIVE'
                    END AS status_display
                FROM employee e
                LEFT JOIN product p ON e.product_id = p.id
                ORDER BY e.id
                """;

        return jdbcTemplate.queryForList(fetchSql);
    }

    @Override
    public void delete(int id) {
        // Get employee details
        Map<String, Object> emp = jdbcTemplate.queryForMap(
                "SELECT emp_name, emp_email FROM employee WHERE id='" + id + "'");

        String empName = (String) emp.get("emp_name");
        String empEmail = (String) emp.get("emp_email");

        // Delete from both tables
        jdbcTemplate.update("DELETE FROM employee WHERE id='" + id + "'");

        // Delete from login using either username or email
        jdbcTemplate.update("DELETE FROM loginTable WHERE username='" + empName + "'");
    }

    @Override
    public void saveFromLogin(String username) {
        String sql = "INSERT INTO employee (emp_name, emp_role, is_active, status) " +
                "VALUES ('" + username + "', 'EMPLOYEE', false, 'IN_PROGRESS')";
        jdbcTemplate.update(sql);
    }

    @Override
    public Map<String, Object> findByEmail(String empEmail) {
        String sql = "SELECT * FROM employee WHERE emp_email = '" + empEmail + "'";
        return jdbcTemplate.queryForMap(sql);
    }

    @Override
    public Map<String, Object> findById(int id) {
        return jdbcTemplate.queryForMap("SELECT * FROM employee WHERE id = '" + id + "'");
    }

    @Override
    public List<Map<String, Object>> getRoleDistribution() {
        return jdbcTemplate.queryForList(
                "SELECT emp_role AS role, COUNT(*) AS count FROM employee GROUP BY emp_role"
        );
    }

    @Override
    public List<Map<String, Object>> getRevenueByProduct() {
        String sql = """
                SELECT p.product_name as product,
                       SUM(r.revenue_amount) as total_revenue
                FROM revenue r
                JOIN product p ON r.product_id = p.id
                GROUP BY p.product_name
                ORDER BY total_revenue DESC
                """;
        return jdbcTemplate.queryForList(sql);
    }

    @Override
    public List<Map<String, Object>> getProductPerformance(String productName) {
        String sql =
                "SELECT TO_CHAR(r.month_year, 'Mon YYYY') as month, " +
                "       r.month_year as date, " +
                "       SUM(r.revenue_amount) as revenue, " +
                "       SUM(r.expense_amount) as expenses, " +
                "       SUM(r.profit) as profit " +
                "FROM revenue r " +
                "JOIN product p ON r.product_id = p.id " +
                "WHERE p.product_name = '" + productName + "' " +
                "GROUP BY r.month_year " +
                "ORDER BY r.month_year";

        return jdbcTemplate.queryForList(sql);
    }

    @Override
    public List<Map<String, Object>> getYearComparison(String productName) {
        String sql =
                "SELECT EXTRACT(YEAR FROM r.month_year) as year, " +
                "       COUNT(*) as sales " +
                "FROM revenue r " +
                "JOIN product p ON r.product_id = p.id " +
                "WHERE p.product_name = '" + productName + "' " +
                "GROUP BY EXTRACT(YEAR FROM r.month_year) " +
                "ORDER BY year";

        return jdbcTemplate.queryForList(sql);
    }

    @Override
    public List<Map<String, Object>> getTopClients(String productName) {
        String sql =
                "SELECT r.client_name as client, " +
                "       SUM(r.revenue_amount) as total_revenue, " +
                "       COUNT(*) as transaction_count " +
                "FROM revenue r " +
                "JOIN product p ON r.product_id = p.id " +
                "WHERE p.product_name = '" + productName + "' " +
                "  AND r.client_name IS NOT NULL " +
                "GROUP BY r.client_name " +
                "ORDER BY total_revenue DESC " +
                "LIMIT 5";

        return jdbcTemplate.queryForList(sql);
    }

    @Override
    public Map<String, Object> getMonthlyGrowth(String productName) {
        String sql =
                "WITH monthly_revenue AS ( " +
                "    SELECT r.month_year, " +
                "           SUM(r.revenue_amount) as revenue " +
                "    FROM revenue r " +
                "    JOIN product p ON r.product_id = p.id " +
                "    WHERE p.product_name = '" + productName + "' " +
                "    GROUP BY r.month_year " +
                "    ORDER BY r.month_year DESC " +
                "    LIMIT 2 " +
                ") " +
                "SELECT " +
                "    (SELECT revenue FROM monthly_revenue ORDER BY month_year DESC LIMIT 1) as current_month, " +
                "    (SELECT revenue FROM monthly_revenue ORDER BY month_year ASC LIMIT 1) as previous_month";

        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);

        if (list.isEmpty()) return Map.of("growthPercentage", 0);

        Map<String, Object> row = list.get(0);

        double current = row.get("current_month") != null
                ? ((Number) row.get("current_month")).doubleValue()
                : 0;

        double previous = row.get("previous_month") != null
                ? ((Number) row.get("previous_month")).doubleValue()
                : 0;

        double growth = previous > 0 ? ((current - previous) / previous) * 100 : 0;

        return Map.of(
                "currentMonth", current,
                "previousMonth", previous,
                "growthPercentage", growth
        );
    }

    @Override
    public List<Map<String, Object>> getMonthlySalesDistribution(String productName) {
        String sql =
                "SELECT TO_CHAR(r.month_year, 'Mon') as month, " +
                "       EXTRACT(MONTH FROM r.month_year) as month_num, " +
                "       COUNT(*) as sales_count, " +
                "       SUM(r.revenue_amount) as total_revenue " +
                "FROM revenue r " +
                "JOIN product p ON r.product_id = p.id " +
                "WHERE p.product_name = '" + productName + "' " +
                "  AND EXTRACT(YEAR FROM r.month_year) = EXTRACT(YEAR FROM CURRENT_DATE) " +
                "GROUP BY TO_CHAR(r.month_year, 'Mon'), EXTRACT(MONTH FROM r.month_year) " +
                "ORDER BY month_num";

        return jdbcTemplate.queryForList(sql, new Object[]{}); // no params, but method requires varargs; can omit second arg entirely
    }

    @Override
    public List<Map<String, Object>> getCompanyMonthlySales() {
        String sql = """
                SELECT TO_CHAR(r.month_year, 'Mon') as month,
                       EXTRACT(MONTH FROM r.month_year) as month_num,
                       COUNT(*) as sales_count,
                       SUM(r.revenue_amount) as total_revenue
                FROM revenue r
                WHERE EXTRACT(YEAR FROM r.month_year) = EXTRACT(YEAR FROM CURRENT_DATE)
                GROUP BY TO_CHAR(r.month_year, 'Mon'), EXTRACT(MONTH FROM r.month_year)
                ORDER BY month_num
                """;
        return jdbcTemplate.queryForList(sql);
    }
}

