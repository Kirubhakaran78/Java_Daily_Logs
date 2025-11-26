//package com.example.demo.repo.product;
//
//import java.util.List;
//import java.util.Map;
//import java.math.BigDecimal;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.stereotype.Repository;
//
//@Repository
//public class ProductDaoImpl implements ProductDao {
//
//    @Autowired
//    private JdbcTemplate jdbcTemplate;
//
//    @Override
//    public Map<String, Object> save(Map<String, Object> jsonData) {
//        String productName = jsonData.get("product_name").toString();
//        String budgetStr = jsonData.get("budget_per_annum").toString().replace(",", "");
//        BigDecimal budgetPerAnnum = new BigDecimal(budgetStr);
//        int totalEmployees = Integer.parseInt(jsonData.get("total_employees").toString());
//        
//      
//        
//     // NOW GET team_lead_id instead of team_lead_name
//        Integer teamLeadId = null;
//        if (jsonData.containsKey("team_lead_id") && jsonData.get("team_lead_id") != null) {
//            String val = jsonData.get("team_lead_id").toString();
//            if (!val.isEmpty() && !val.equals("") && !val.equals("null")) {
//                teamLeadId = Integer.parseInt(val);
//            }
//        }
//
//        // ✅ Insert with team_lead_id
//        String sql = "INSERT INTO product (product_name, budget_per_annum, total_employees, team_lead_id) VALUES (?, ?, ?, ?)";
//        jdbcTemplate.update(sql, productName, budgetPerAnnum, totalEmployees, teamLeadId);
//
//        System.out.println("Product added successfully: " + productName);
//
//        // Fetch newly inserted record
//        String fetchSql = "SELECT * FROM product ORDER BY id DESC LIMIT 1";
//        return jdbcTemplate.queryForMap(fetchSql);
//    }
//
//    @Override
//    public void update(Map<String, Object> jsonData) {
//        int id = Integer.parseInt(jsonData.get("id").toString());
//        String productName = jsonData.get("product_name").toString();
//        String budgetStr = jsonData.get("budget_per_annum").toString().replace(",", "");
//        BigDecimal budgetPerAnnum = new BigDecimal(budgetStr);
//        int totalEmployees = Integer.parseInt(jsonData.get("total_employees").toString());
//        
//     // ✅ NOW GET team_lead_id instead of team_lead_name
//        Integer teamLeadId = null;
//        if (jsonData.containsKey("team_lead_id") && jsonData.get("team_lead_id") != null) {
//            String val = jsonData.get("team_lead_id").toString();
//            if (!val.isEmpty() && !val.equals("") && !val.equals("null")) {
//                teamLeadId = Integer.parseInt(val);
//            }
//        }
//
//        // ✅ Update with team_lead_id
//        String sql = "UPDATE product SET product_name = ?, budget_per_annum = ?, total_employees = ?, team_lead_id = ? WHERE id = ?";
//        jdbcTemplate.update(sql, productName, budgetPerAnnum, totalEmployees, teamLeadId, id);
//
//        System.out.println("Product updated successfully (ID: " + id + ")");
//    }
//
//    @Override
//    public List<Map<String, Object>> findAll() {
//        // ✅ JOIN with employee to get team lead name
//        String sql = "SELECT p.*, e.emp_name as team_lead_name " +
//                     "FROM product p " +
//                     "LEFT JOIN employee e ON p.team_lead_id = e.id " +
//                     "ORDER BY p.id";
//        return jdbcTemplate.queryForList(sql);
//    }
//
//    @Override
//    public void delete(int id) {
//        String sql = "DELETE FROM product WHERE id = ?";
//        jdbcTemplate.update(sql, id);
//        System.out.println("Product deleted with ID: " + id);
//    }
//}

package com.example.demo.repo.product;

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

    @Override
    public Map<String, Object> save(Map<String, Object> jsonData) {
        String productName = jsonData.get("product_name").toString();
        String budgetStr = jsonData.get("budget_per_annum").toString().replace(",", "");
        BigDecimal budgetPerAnnum = new BigDecimal(budgetStr);
        int totalEmployees = Integer.parseInt(jsonData.get("total_employees").toString());

        // NOW GET team_lead_id instead of team_lead_name
        Integer teamLeadId = null;
        if (jsonData.containsKey("team_lead_id") && jsonData.get("team_lead_id") != null) {
            String val = jsonData.get("team_lead_id").toString();
            if (!val.isEmpty() && !val.equals("") && !val.equals("null")) {
                teamLeadId = Integer.parseInt(val);
            }
        }

        // Insert with team_lead_id using string concatenation
        String sql = "INSERT INTO product (product_name, budget_per_annum, total_employees, team_lead_id) VALUES (" +
                     "'" + productName + "', " +
                     "'" + budgetPerAnnum + "', " +
                     "'" + totalEmployees + "', " +
                     "'" + teamLeadId + "'" +
                     ")";
        jdbcTemplate.update(sql);

        System.out.println("Product added successfully: " + productName);

        // Fetch newly inserted record
        String fetchSql = "SELECT * FROM product ORDER BY id DESC LIMIT 1";
        return jdbcTemplate.queryForMap(fetchSql);
    }

    @Override
    public void update(Map<String, Object> jsonData) {
        int id = Integer.parseInt(jsonData.get("id").toString());
        String productName = jsonData.get("product_name").toString();
        String budgetStr = jsonData.get("budget_per_annum").toString().replace(",", "");
        BigDecimal budgetPerAnnum = new BigDecimal(budgetStr);
        int totalEmployees = Integer.parseInt(jsonData.get("total_employees").toString());

        // NOW GET team_lead_id instead of team_lead_name
        Integer teamLeadId = null;
        if (jsonData.containsKey("team_lead_id") && jsonData.get("team_lead_id") != null) {
            String val = jsonData.get("team_lead_id").toString();
            if (!val.isEmpty() && !val.equals("") && !val.equals("null")) {
                teamLeadId = Integer.parseInt(val);
            }
        }

        // Update with team_lead_id using string concatenation
        String sql = "UPDATE product SET " +
                     "product_name = '" + productName + "', " +
                     "budget_per_annum = '" + budgetPerAnnum + "', " +
                     "total_employees = '" + totalEmployees + "', " +
                     "team_lead_id = '" + teamLeadId + "' " +
                     "WHERE id = '" + id + "'";
        jdbcTemplate.update(sql);

        System.out.println("Product updated successfully (ID: " + id + ")");
    }

    @Override
    public List<Map<String, Object>> findAll() {
        // JOIN with employee to get team lead name
        String sql = "SELECT p.*, e.emp_name as team_lead_name " +
                     "FROM product p " +
                     "LEFT JOIN employee e ON p.team_lead_id = e.id " +
                     "ORDER BY p.id";
        return jdbcTemplate.queryForList(sql);
    }

    @Override
    public void delete(int id) {
        String sql = "DELETE FROM product WHERE id = '" + id + "'";
        jdbcTemplate.update(sql);
        System.out.println("Product deleted with ID: " + id);
    }
}

