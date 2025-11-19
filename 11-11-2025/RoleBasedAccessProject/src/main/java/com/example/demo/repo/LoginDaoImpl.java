package com.example.demo.repo;

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
        String sql = "SELECT * FROM loginTable WHERE username = ?";
        List<Map<String,Object>> rows = jdbcTemplate.queryForList(sql, username);
        return rows.isEmpty() ? null : rows.get(0);
    }

    @Override
    public void save(Map<String, Object> jsonData) {
        String username = (String) jsonData.getOrDefault("username","admin");
        String password = (String) jsonData.getOrDefault("password","admin");
        String role = (String) jsonData.getOrDefault("role", "EMPLOYEE");
        String product_name = (String) jsonData.getOrDefault("product_name", "");

        String insertSql = "INSERT INTO loginTable(username, password, role, product_name) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(insertSql, username, password, role, product_name);
    }

    @Override
    public List<Map<String, Object>> findAll() {
        String fetchSql="SELECT * FROM loginTable";
        return jdbcTemplate.queryForList(fetchSql);
    }

    @Override
    public void updatePassword(String username, String password) {
        String updateSql = "UPDATE loginTable SET password = ? WHERE username = ?";
        jdbcTemplate.update(updateSql, password, username);
    }
}