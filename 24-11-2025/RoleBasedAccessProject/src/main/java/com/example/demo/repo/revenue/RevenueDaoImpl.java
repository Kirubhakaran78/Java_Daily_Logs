//package com.example.demo.repo.revenue;
//
//import java.util.List;
//import java.util.Map;
//import java.math.BigDecimal;
//import java.sql.Date;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.stereotype.Repository;
//
//@Repository
//public class RevenueDaoImpl implements RevenueDao {
//    
//    @Autowired
//    private JdbcTemplate jdbcTemplate;
//    
//    @Override
//    public Map<String, Object> save(Map<String, Object> jsonData) {   	
//    	// NOW GET product_id instead of product_name
//        Integer product_id = null;
//        if (jsonData.containsKey("product_id") && jsonData.get("product_id") != null) {
//            String val = jsonData.get("product_id").toString();
//            if (!val.isEmpty() && !val.equals("") && !val.equals("null")) {
//                product_id = Integer.parseInt(val);
//            }
//        }
//        
//        // Convert month_year to DATE format (YYYY-MM-DD)
//        String monthYearStr = (String) jsonData.getOrDefault("month_year", "2025-01-01");
//        Date month_year = Date.valueOf(monthYearStr);
//        
//        // Use BigDecimal for amounts
//        BigDecimal revenue_amount = new BigDecimal(jsonData.getOrDefault("revenue_amount", "0").toString());
//        BigDecimal expense_amount = new BigDecimal(jsonData.getOrDefault("expense_amount", "0").toString());
//        //calculation for profit
//        BigDecimal profit = revenue_amount.subtract(expense_amount);
//        String client_name = (String) jsonData.getOrDefault("client_name", "");
//        
//     
//        
//        // FIXED: Use PreparedStatement (no SQL injection)
//        // Don't insert profit - it's auto-calculated!
//        String sql = "INSERT INTO revenue (product_id, month_year, revenue_amount, expense_amount,profit, client_name) " +
//                     "VALUES (?, ?, ?, ?, ?, ?)";
//        
//        jdbcTemplate.update(sql, product_id, month_year, revenue_amount, expense_amount,profit, client_name);
//        System.out.println("Inserted revenue record for product_id: " + product_id);
//        
//        // Return latest inserted row
//        String fetchSql = "SELECT * FROM revenue ORDER BY id DESC LIMIT 1";
//        Map<String, Object> savedRecord = jdbcTemplate.queryForMap(fetchSql);
//        return savedRecord;
//    }
//    
//    @Override
//    public void update(Map<String, Object> jsonData) {
//        int id = (int) jsonData.get("id");
//        
//       
//        // now get product_id instead of product_name
//        Integer product_id = null;
//        if (jsonData.containsKey("product_id") && jsonData.get("product_id") != null) {
//            String val = jsonData.get("product_id").toString();
//            if (!val.isEmpty() && !val.equals("") && !val.equals("null")) {
//                product_id = Integer.parseInt(val);
//            }
//        }
//        
//        // Convert to DATE
//        String monthYearStr = (String) jsonData.get("month_year");
//        Date month_year = Date.valueOf(monthYearStr);
//        
//        BigDecimal revenue_amount = new BigDecimal(jsonData.get("revenue_amount").toString());
//        BigDecimal expense_amount = new BigDecimal(jsonData.get("expense_amount").toString());
//        BigDecimal profit = revenue_amount.subtract(expense_amount);
//        String client_name = (String) jsonData.get("client_name");
//        
//        // FIXED: Use PreparedStatement (no SQL injection)
//        // Don't update profit - it's auto-calculated!
//        String updateSql = "UPDATE revenue SET product_id=?, month_year=?, revenue_amount=?, expense_amount=?,profit=?, client_name=? WHERE id=?";
//        
//        jdbcTemplate.update(updateSql, product_id, month_year, revenue_amount, expense_amount,profit, client_name, id);
//        System.out.println("Updated revenue record with ID: " + id);
//    }
//    
//    @Override
//    public void delete(int id) {
//        // FIXED: Use PreparedStatement
//        String deleteSql = "DELETE FROM revenue WHERE id=?";
//        jdbcTemplate.update(deleteSql, id);
//        System.out.println("Deleted revenue record with ID: " + id);
//    }
//    
//    @Override
//    public List<Map<String, Object>> findAll() {
//        // JOIN with product to get product_name for display
//        String fetchSql = "SELECT r.*, p.product_name " +
//                         "FROM revenue r " +
//                         "LEFT JOIN product p ON r.product_id = p.id " +
//                         "ORDER BY r.id";
//        return jdbcTemplate.queryForList(fetchSql);
//    }
//    
//    @Override
//    public List<Map<String, Object>> getCompanyPerformance() {
//        String sql = """
//            SELECT 
//                EXTRACT(YEAR FROM month_year) AS year,
//                SUM(revenue_amount) AS sales,
//                SUM(expense_amount) AS expenses
//            FROM revenue
//            GROUP BY EXTRACT(YEAR FROM month_year)
//            ORDER BY year;
//        """;
//
//        return jdbcTemplate.queryForList(sql);
//    }
//    
//    @Override
//    public List<Map<String, Object>> getProductComparison() {
//
//        String sql = """
//            SELECT 
//                p.product_name AS product,
//                EXTRACT(YEAR FROM r.month_year) AS year,
//                COUNT(*) AS count
//            FROM revenue r
//            LEFT JOIN product p ON r.product_id = p.id
//            WHERE EXTRACT(YEAR FROM r.month_year) >= EXTRACT(YEAR FROM CURRENT_DATE) - 1
//            GROUP BY product, year
//            ORDER BY product, year;
//        """;
//
//        return jdbcTemplate.queryForList(sql);
//    }
//
//
//    
//}

package com.example.demo.repo.revenue;

import java.util.List;
import java.util.Map;
import java.math.BigDecimal;
import java.sql.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class RevenueDaoImpl implements RevenueDao {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Override
    public Map<String, Object> save(Map<String, Object> jsonData) {   	
        // NOW GET product_id instead of product_name
        Integer product_id = null;
        if (jsonData.containsKey("product_id") && jsonData.get("product_id") != null) {
            String val = jsonData.get("product_id").toString();
            if (!val.isEmpty() && !val.equals("") && !val.equals("null")) {
                product_id = Integer.parseInt(val);
            }
        }
        
        // Convert month_year to DATE format (YYYY-MM-DD)
        String monthYearStr = (String) jsonData.getOrDefault("month_year", "2025-01-01");
        Date month_year = Date.valueOf(monthYearStr);
        
        // Use BigDecimal for amounts
        BigDecimal revenue_amount = new BigDecimal(jsonData.getOrDefault("revenue_amount", "0").toString());
        BigDecimal expense_amount = new BigDecimal(jsonData.getOrDefault("expense_amount", "0").toString());
        // calculation for profit
        BigDecimal profit = revenue_amount.subtract(expense_amount);
        String client_name = (String) jsonData.getOrDefault("client_name", "");
        
        // Insert using string concatenation
        String sql = "INSERT INTO revenue (product_id, month_year, revenue_amount, expense_amount, profit, client_name) " +
                     "VALUES (" +
                     "'" + product_id + "', " +
                     "'" + month_year + "', " +
                     "'" + revenue_amount + "', " +
                     "'" + expense_amount + "', " +
                     "'" + profit + "', " +
                     "'" + client_name + "'" +
                     ")";
        
        jdbcTemplate.update(sql);
        System.out.println("Inserted revenue record for product_id: " + product_id);
        
        // Return latest inserted row
        String fetchSql = "SELECT * FROM revenue ORDER BY id DESC LIMIT 1";
        Map<String, Object> savedRecord = jdbcTemplate.queryForMap(fetchSql);
        return savedRecord;
    }
    
    @Override
    public void update(Map<String, Object> jsonData) {
        int id = (int) jsonData.get("id");
        
        // now get product_id instead of product_name
        Integer product_id = null;
        if (jsonData.containsKey("product_id") && jsonData.get("product_id") != null) {
            String val = jsonData.get("product_id").toString();
            if (!val.isEmpty() && !val.equals("") && !val.equals("null")) {
                product_id = Integer.parseInt(val);
            }
        }
        
        // Convert to DATE
        String monthYearStr = (String) jsonData.get("month_year");
        Date month_year = Date.valueOf(monthYearStr);
        
        BigDecimal revenue_amount = new BigDecimal(jsonData.get("revenue_amount").toString());
        BigDecimal expense_amount = new BigDecimal(jsonData.get("expense_amount").toString());
        BigDecimal profit = revenue_amount.subtract(expense_amount);
        String client_name = (String) jsonData.get("client_name");
        
        // Update using string concatenation
        String updateSql = "UPDATE revenue SET " +
                           "product_id='" + product_id + "', " +
                           "month_year='" + month_year + "', " +
                           "revenue_amount='" + revenue_amount + "', " +
                           "expense_amount='" + expense_amount + "', " +
                           "profit='" + profit + "', " +
                           "client_name='" + client_name + "' " +
                           "WHERE id='" + id + "'";
        
        jdbcTemplate.update(updateSql);
        System.out.println("Updated revenue record with ID: " + id);
    }
    
    @Override
    public void delete(int id) {
        String deleteSql = "DELETE FROM revenue WHERE id='" + id + "'";
        jdbcTemplate.update(deleteSql);
        System.out.println("Deleted revenue record with ID: " + id);
    }
    
    @Override
    public List<Map<String, Object>> findAll() {
        // JOIN with product to get product_name for display
        String fetchSql = "SELECT r.*, p.product_name " +
                          "FROM revenue r " +
                          "LEFT JOIN product p ON r.product_id = p.id " +
                          "ORDER BY r.id";
        return jdbcTemplate.queryForList(fetchSql);
    }
    
    @Override
    public List<Map<String, Object>> getCompanyPerformance() {
        String sql = """
            SELECT 
                EXTRACT(YEAR FROM month_year) AS year,
                SUM(revenue_amount) AS sales,
                SUM(expense_amount) AS expenses
            FROM revenue
            GROUP BY EXTRACT(YEAR FROM month_year)
            ORDER BY year;
        """;

        return jdbcTemplate.queryForList(sql);
    }
    
    @Override
    public List<Map<String, Object>> getProductComparison() {
        String sql = """
            SELECT 
                p.product_name AS product,
                EXTRACT(YEAR FROM r.month_year) AS year,
                COUNT(*) AS count
            FROM revenue r
            LEFT JOIN product p ON r.product_id = p.id
            WHERE EXTRACT(YEAR FROM r.month_year) >= EXTRACT(YEAR FROM CURRENT_DATE) - 1
            GROUP BY product, year
            ORDER BY product, year;
        """;

        return jdbcTemplate.queryForList(sql);
    }
}
