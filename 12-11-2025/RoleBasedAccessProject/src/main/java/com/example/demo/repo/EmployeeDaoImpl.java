package com.example.demo.repo;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class EmployeeDaoImpl implements EmployeeDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    

@Autowired
private LoginDaoImpl loginDao;

//    @Override
//    public Map<String, Object> save(Map<String, Object> jsonData) {
//        String emp_id = (String) jsonData.getOrDefault("emp_id", "101");
//        String emp_name = (String) jsonData.getOrDefault("emp_name", "John");
//        String emp_email = (String) jsonData.getOrDefault("emp_email", "john@example.com");
//        String product_name = (String) jsonData.getOrDefault("product_name","SDMS");
//        String emp_role = (String) jsonData.getOrDefault("emp_role", "Administrator");
//        String site = (String) jsonData.getOrDefault("site", "Chennai");
//        Object isActiveObj = jsonData.getOrDefault("is_active", false);
//        String is_active = String.valueOf(isActiveObj);
//        String date_of_joining = (String) jsonData.getOrDefault("date_of_joining", "2025-01-01");
//
//        String sql = "INSERT INTO employee (emp_id, emp_name, emp_email, product_name, emp_role, site, is_active, date_of_joining) "
//                   + "VALUES ('" + emp_id + "', '" + emp_name + "', '" + emp_email + "', '" + product_name + "', '"
//                   + emp_role + "', '" + site + "', '" + is_active + "', '" + date_of_joining + "')";
//
//        jdbcTemplate.update(sql);
//        System.out.println("Inserted record for employee: " + emp_name);
//
//        // return latest inserted row
//        String fetchSql = "SELECT * FROM employee ORDER BY id DESC LIMIT 1";
//        Map<String, Object> savedRecord = jdbcTemplate.queryForMap(fetchSql);
//        return savedRecord;
//    }



@Override
public Map<String, Object> save(Map<String, Object> jsonData) {
    String emp_id = (String) jsonData.getOrDefault("emp_id", "101");
    String emp_name = (String) jsonData.getOrDefault("emp_name", "John");
    String emp_email = (String) jsonData.getOrDefault("emp_email", "john@example.com");
    String product_name = (String) jsonData.getOrDefault("product_name", "SDMS");
    String emp_role = (String) jsonData.getOrDefault("emp_role", "Employee");
    String site = (String) jsonData.getOrDefault("site", "Chennai");
    Object isActiveObj = jsonData.getOrDefault("is_active", false);
    boolean is_active = (isActiveObj instanceof Boolean) ? (Boolean) isActiveObj : Boolean.parseBoolean(isActiveObj.toString());
    
    // ✅ Convert date string to java.sql.Date
    String dateStr = (String) jsonData.getOrDefault("date_of_joining", "2025-01-01");
    java.sql.Date date_of_joining = java.sql.Date.valueOf(dateStr);

    // Insert into employee table
    String sql = "INSERT INTO employee (emp_id, emp_name, emp_email, product_name, emp_role, site, is_active, date_of_joining) "
               + "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    jdbcTemplate.update(sql, emp_id, emp_name, emp_email, product_name, emp_role, site, is_active, date_of_joining);
    System.out.println("Inserted record for employee: " + emp_name);

    // Create login record if not exists
    String checkSql = "SELECT COUNT(*) FROM loginTable WHERE username = ?";
    int count = jdbcTemplate.queryForObject(checkSql, Integer.class, emp_name);

    if (count == 0) {
        String defaultPassword = "1234";
        String insertLogin = "INSERT INTO loginTable(username, password, role, product_name) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(insertLogin, emp_name, defaultPassword, emp_role, product_name);
        System.out.println("Created login for employee: " + emp_name);
    }

    // Fetch and return latest inserted record
    String fetchSql = "SELECT * FROM employee ORDER BY id DESC LIMIT 1";
    return jdbcTemplate.queryForMap(fetchSql);
}


//    @Override
//    public void update(Map<String, Object> jsonData) {
//        int id = (int) jsonData.get("id");
//        String emp_id = (String) jsonData.get("emp_id");
//        String emp_name = (String) jsonData.get("emp_name");
//        String emp_email = (String) jsonData.get("emp_email");
//        String product_name = (String) jsonData.get("product_name");
//        String emp_role = (String) jsonData.get("emp_role");
//        String site = (String) jsonData.get("site");
//        Object isActiveObj = jsonData.get("is_active");
//        String is_active = String.valueOf(isActiveObj);
//        String date_of_joining = (String) jsonData.get("date_of_joining");
//
//        String updateSql = "UPDATE employee SET "
//                         + "emp_id='" + emp_id + "', "
//                         + "emp_name='" + emp_name + "', "
//                         + "emp_email='" + emp_email + "', "
//                         + "product_name='" + product_name + "', "
//                         + "emp_role='" + emp_role + "', "
//                         + "site='" + site + "', "
//                         + "is_active='" + is_active + "', "
//                         + "date_of_joining='" + date_of_joining + "' "
//                         + "WHERE id=" + id;
//
//        jdbcTemplate.update(updateSql);
//        System.out.println("Updated record with ID: " + id);
//    }

@Override
public void update(Map<String, Object> jsonData) {
    int id = (int) jsonData.get("id");
    String emp_id = (String) jsonData.get("emp_id");
    String emp_name = (String) jsonData.get("emp_name");
    String emp_email = (String) jsonData.get("emp_email");
    String product_name = (String) jsonData.get("product_name");
    String emp_role = (String) jsonData.get("emp_role");
    String site = (String) jsonData.get("site");
    Object isActiveObj = jsonData.get("is_active");
    boolean is_active = (isActiveObj instanceof Boolean) ? (Boolean) isActiveObj : Boolean.parseBoolean(isActiveObj.toString());
    
    // ✅ Convert date string to SQL Date
    String dateStr = (String) jsonData.get("date_of_joining");
    java.sql.Date date_of_joining = java.sql.Date.valueOf(dateStr);

    String updateEmpSql = "UPDATE employee SET emp_id=?, emp_name=?, emp_email=?, product_name=?, emp_role=?, site=?, is_active=?, date_of_joining=? WHERE id=?";
    jdbcTemplate.update(updateEmpSql, emp_id, emp_name, emp_email, product_name, emp_role, site, is_active, date_of_joining, id);

    System.out.println("Updated employee with ID: " + id);

    String updateLoginSql = "UPDATE loginTable SET role=?, product_name=? WHERE username=?";
    jdbcTemplate.update(updateLoginSql, emp_role, product_name, emp_name);
}



    @Override
    public List<Map<String, Object>> findAll() {
        String fetchSql = "SELECT * FROM employee";
        return jdbcTemplate.queryForList(fetchSql);
    }

//    @Override
//    public void delete(int id) {
//        String deleteSql = "DELETE FROM employee WHERE id=" + id;
//        jdbcTemplate.update(deleteSql);
//        System.out.println("Deleted employee record with ID: " + id);
//    }
    
    @Override
    public void delete(int id) {
        // Fetch username before deleting
        String empName = jdbcTemplate.queryForObject("SELECT emp_name FROM employee WHERE id=?", String.class, id);

        // Delete employee
        jdbcTemplate.update("DELETE FROM employee WHERE id=?", id);

        // Delete from login table as well
        jdbcTemplate.update("DELETE FROM loginTable WHERE username=?", empName);

        System.out.println("Deleted employee and login for user: " + empName);
    }

    
    
    

    @Override
    public void saveFromLogin(String username) {
        // You can customize columns as per your employeeTable
        String sql = "INSERT INTO employee (emp_name) VALUES ('"+username+"')";
        jdbcTemplate.update(sql);
    }
}
