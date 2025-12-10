package com.example.demo.repo.login;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class LoginDaoImpl implements LoginDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public Map<String, Object> findByUsername(String username) {
        String sql = "SELECT * FROM loginTable WHERE username = '" + username + "'";
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
        return rows.isEmpty() ? null : rows.get(0);
    }

    @Override
    public void save(Map<String, Object> jsonData) {
        String username = (String) jsonData.getOrDefault("username", "admin");
        String password = (String) jsonData.getOrDefault("password", "admin");
        String role = (String) jsonData.get("role");

        // force default role if not provided
        if (role == null || role.trim().isEmpty()) {
            role = "EMPLOYEE";
        }

        String product_name = (String) jsonData.getOrDefault("product_name", "");

        String insertSql = "INSERT INTO loginTable(username, password, role, product_name) " +
                "VALUES ('" + username + "', '" + password + "', '" + role + "', '" + product_name + "')";
        jdbcTemplate.update(insertSql);

        // Get product_id from product_name
        Integer product_id = null;
        if (product_name != null && !product_name.isEmpty()) {
            List<Map<String, Object>> productResult = jdbcTemplate.queryForList(
                    "SELECT id FROM product WHERE product_name = '" + product_name + "'");
            if (!productResult.isEmpty()) {
                product_id = (Integer) productResult.get(0).get("id");
            }
        }

        // Insert into employee table
        String empSql = "INSERT INTO employee (emp_name, emp_email, emp_role, product_id, is_active, status) " +
                "VALUES ('" + username + "', '" + username + "', '" + role + "', '" + product_id + "', false, 'IN_PROGRESS')";
        jdbcTemplate.update(empSql);
    }

    @Override
    public List<Map<String, Object>> findAll() {
        String fetchSql = "SELECT * FROM loginTable";
        return jdbcTemplate.queryForList(fetchSql);
    }

    @Override
    public void updatePassword(String username, String password) {
        String updateSql = "UPDATE loginTable SET password = '" + password + "' WHERE username = '" + username + "'";
        jdbcTemplate.update(updateSql);
    }

    @Override
    public void update(Map<String, Object> jsonData) {
        String username = (String) jsonData.get("username");
        String role = (String) jsonData.get("role");
        String product_name = (String) jsonData.get("product_name");

        // Update loginTable
        String updateLoginSql = "UPDATE loginTable SET role='" + role + "', product_name='" + product_name + "' WHERE username='" + username + "'";
        jdbcTemplate.update(updateLoginSql);

        // Get product_id from product_name
        Integer product_id = null;
        if (product_name != null && !product_name.isEmpty()) {
            List<Map<String, Object>> productResult = jdbcTemplate.queryForList(
                    "SELECT id FROM product WHERE product_name = '" + product_name + "'");
            if (!productResult.isEmpty()) {
                product_id = (Integer) productResult.get(0).get("id");
            }
        }

        // Update employee table
        String updateEmpSql = "UPDATE employee SET emp_role='" + role + "', product_id='" + product_id + "' " +
                "WHERE emp_email='" + username + "' OR emp_name='" + username + "'";
        jdbcTemplate.update(updateEmpSql);
    }
}
