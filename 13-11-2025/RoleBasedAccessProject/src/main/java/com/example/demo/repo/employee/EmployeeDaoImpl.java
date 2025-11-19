package com.example.demo.repo.employee;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.demo.repo.login.LoginDaoImpl;

@Repository
public class EmployeeDaoImpl implements EmployeeDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private LoginDaoImpl loginDao;

    @Override
    public Map<String, Object> save(Map<String, Object> jsonData) {
        String emp_name = (String) jsonData.getOrDefault("emp_name", "John");
        String emp_email = (String) jsonData.getOrDefault("emp_email", "john@example.com");
       
        
     // NOW GET product_id instead of product_name
        Integer product_id = null;
        if (jsonData.containsKey("product_id") && jsonData.get("product_id") != null) {
            String val = jsonData.get("product_id").toString();
            if (!val.isEmpty() && !val.equals("") && !val.equals("null")) {
                product_id = Integer.parseInt(val);
            }
        }
        
        String emp_role = (String) jsonData.getOrDefault("emp_role", "EMPLOYEE");
        String site = (String) jsonData.getOrDefault("site", "Chennai");
        Object isActiveObj = jsonData.getOrDefault("is_active", true);
        boolean is_active = (isActiveObj instanceof Boolean) ? (Boolean) isActiveObj : Boolean.parseBoolean(isActiveObj.toString());

        String dateStr = (String) jsonData.getOrDefault("date_of_joining", "2025-01-01");
        java.sql.Date date_of_joining = java.sql.Date.valueOf(dateStr);

        // Use product_id instead of product_name
        String sql = "INSERT INTO employee (emp_name, emp_email, product_id, emp_role, site, is_active, date_of_joining) "
                   + "VALUES (?, ?, ?, ?, ?, ?, ?)";

        jdbcTemplate.update(sql, emp_name, emp_email, product_id, emp_role, site, is_active, date_of_joining);
        System.out.println("Inserted employee: " + emp_name);

        // Get product_name for login table (still needed there)
        String product_name = null;
        if (product_id != null) {
            product_name = jdbcTemplate.queryForObject(
                "SELECT product_name FROM product WHERE id = ?", 
                String.class, 
                product_id
            );
        }

        // Create login if not exists
        String checkSql = "SELECT COUNT(*) FROM loginTable WHERE username = ?";
        int count = jdbcTemplate.queryForObject(checkSql, Integer.class, emp_name);
        if (count == 0) {
            String defaultPassword = "1234"; // In production, need to use bcrypt!
            String insertLogin = "INSERT INTO loginTable(username, password, role, product_name) VALUES (?, ?, ?, ?)";
            jdbcTemplate.update(insertLogin, emp_name, defaultPassword, emp_role, product_name);
        }

        // Fetch and return latest record
        String fetchSql = "SELECT * FROM employee ORDER BY id DESC LIMIT 1";
        return jdbcTemplate.queryForMap(fetchSql);
    }

    @Override
    public void update(Map<String, Object> jsonData) {
        int id = (int) jsonData.get("id");
        String emp_id = (String) jsonData.get("emp_id");
        String emp_name = (String) jsonData.get("emp_name");
        String emp_email = (String) jsonData.get("emp_email");
      
        
     // NOW GET product_id instead of product_name
        Integer product_id = null;
        if (jsonData.containsKey("product_id") && jsonData.get("product_id") != null) {
            String val = jsonData.get("product_id").toString();
            if (!val.isEmpty() && !val.equals("") && !val.equals("null")) {
                product_id = Integer.parseInt(val);
            }
        }
        
        String emp_role = (String) jsonData.get("emp_role");
        String site = (String) jsonData.get("site");
        Object isActiveObj = jsonData.get("is_active");
        boolean is_active = (isActiveObj instanceof Boolean) ? (Boolean) isActiveObj : Boolean.parseBoolean(isActiveObj.toString());
        
        String dateStr = (String) jsonData.get("date_of_joining");
        java.sql.Date date_of_joining = java.sql.Date.valueOf(dateStr);

        // Update with product_id
        String updateEmpSql = "UPDATE employee SET emp_id=?, emp_name=?, emp_email=?, product_id=?, emp_role=?, site=?, is_active=?, date_of_joining=? WHERE id=?";
        jdbcTemplate.update(updateEmpSql, emp_id, emp_name, emp_email, product_id, emp_role, site, is_active, date_of_joining, id);

        System.out.println("Updated employee with ID: " + id);

        // Get product_name for login table update
        String product_name = null;
        if (product_id != null) {
            product_name = jdbcTemplate.queryForObject(
                "SELECT product_name FROM product WHERE id = ?", 
                String.class, 
                product_id
            );
        }

        // Update login table
        String updateLoginSql = "UPDATE loginTable SET role=?, product_name=? WHERE username=?";
        jdbcTemplate.update(updateLoginSql, emp_role, product_name, emp_name);
    }

//    @Override
//    public List<Map<String, Object>> findAll() {
//        // JOIN with product table to get product_name for display
//        String fetchSql = "SELECT e.*, p.product_name " +
//                         "FROM employee e " +
//                         "LEFT JOIN product p ON e.product_id = p.id " +
//                         "ORDER BY e.id";
//        return jdbcTemplate.queryForList(fetchSql);
//    }
    
    
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
                
                -- STATUS BUSINESS LOGIC HERE
                CASE
                    WHEN e.is_active = false AND e.status = 'IN_PROGRESS' THEN 'IN_PROGRESS'
                    WHEN e.is_active = true THEN 'ACTIVE'
                    WHEN e.is_active = false THEN 'INACTIVE'
                END AS status_display

            FROM employee e
            LEFT JOIN product p ON e.product_id = p.id
            ORDER BY e.id
        """;

        List<Map<String,Object>> list = jdbcTemplate.queryForList(fetchSql);

        // DEBUG PRINT
        list.forEach(row -> System.out.println("DEBUG EMPLOYEE: " + row));

        return list;
    }


    @Override
    public void delete(int id) {
        // Fetch username before deleting
        String empName = jdbcTemplate.queryForObject("SELECT emp_name FROM employee WHERE id=?", String.class, id);

        // Delete employee
        jdbcTemplate.update("DELETE FROM employee WHERE id=?", id);

        // Delete from login table
        jdbcTemplate.update("DELETE FROM loginTable WHERE username=?", empName);

        System.out.println("Deleted employee and login for user: " + empName);
    }

    @Override
    public void saveFromLogin(String username) {
        String sql = "INSERT INTO employee (emp_name) VALUES (?)";
        jdbcTemplate.update(sql, username);
    }

    @Override
    public Map<String, Object> findByEmail(String empEmail) {
        String sql = "SELECT * FROM employee WHERE emp_email = ?";
        return jdbcTemplate.queryForMap(sql, empEmail);
    }
    
    @Override
    public Map<String, Object> findById(int id) {
        return jdbcTemplate.queryForMap("SELECT * FROM employee WHERE id = ?", id);
    }
}
