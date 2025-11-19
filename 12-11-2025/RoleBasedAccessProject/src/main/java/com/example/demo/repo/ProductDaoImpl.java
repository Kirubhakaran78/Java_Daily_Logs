package com.example.demo.repo;

import java.util.List;
import java.util.Map;
import java.math.BigDecimal;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ProductDaoImpl implements ProductDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Save new product
    @Override
    public Map<String, Object> save(Map<String, Object> jsonData) {
        String productId = jsonData.get("product_id").toString();
        String productName = jsonData.get("product_name").toString();
        String budgetStr = jsonData.get("budget_per_annum").toString().replace(",", "");
        BigDecimal budgetPerAnnum = new BigDecimal(budgetStr);
        
        
        int totalEmployees = Integer.parseInt(jsonData.get("total_employees").toString());
        String teamLeadName = jsonData.get("team_lead_name").toString();

        String sql = "INSERT INTO product (product_id, product_name, budget_per_annum, total_employees, team_lead_name) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, productId, productName, budgetPerAnnum, totalEmployees, teamLeadName);

        System.out.println("Product added successfully: " + productName);

        String fetchSql = "SELECT * FROM product ORDER BY id DESC LIMIT 1";
        return jdbcTemplate.queryForMap(fetchSql);
    }

    // Update existing product
    @Override
    public void update(Map<String, Object> jsonData) {
        int id = Integer.parseInt(jsonData.get("id").toString());
        String productId = jsonData.get("product_id").toString();
        String productName = jsonData.get("product_name").toString();
        
        String budgetStr = jsonData.get("budget_per_annum").toString().replace(",", "");
        BigDecimal budgetPerAnnum = new BigDecimal(budgetStr);
        
        int totalEmployees = Integer.parseInt(jsonData.get("total_employees").toString());
        String teamLeadName = jsonData.get("team_lead_name").toString();

        String sql = "UPDATE product SET product_id = ?, product_name = ?, budget_per_annum = ?, total_employees = ?, team_lead_name = ? WHERE id = ?";
        jdbcTemplate.update(sql, productId, productName, budgetPerAnnum, totalEmployees, teamLeadName, id);

        System.out.println("Product updated successfully (ID: " + id + ")");
    }

    // Get all products
    @Override
    public List<Map<String, Object>> findAll() {
        String sql = "SELECT * FROM product ORDER BY id";
        return jdbcTemplate.queryForList(sql);
    }

    // Delete product
    @Override
    public void delete(int id) {
        String sql = "DELETE FROM product WHERE id = ?";
        jdbcTemplate.update(sql, id);
        System.out.println("Product deleted with ID: " + id);
    }
}
