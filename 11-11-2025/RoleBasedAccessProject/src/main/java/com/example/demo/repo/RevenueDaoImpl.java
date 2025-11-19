package com.example.demo.repo;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class RevenueDaoImpl implements RevenueDao {
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Override
	public Map<String, Object> save(Map<String, Object> jsonData) {
//	    String revenue_id = (String) jsonData.getOrDefault("revenue_id", "REV001");
	    String product_name = (String) jsonData.getOrDefault("product_name", "LIMS");
	    String month_year = (String) jsonData.getOrDefault("month_year", "Jan-2025");
	    String revenue_amount = String.valueOf(jsonData.getOrDefault("revenue_amount", "0"));
	    String expense_amount = String.valueOf(jsonData.getOrDefault("expense_amount", "0"));
	    String profit = String.valueOf(jsonData.getOrDefault("profit", "0"));
	    String client_name = (String) jsonData.getOrDefault("client_name", "");
	    
	    String sql = "INSERT INTO revenue ( product_name, month_year, revenue_amount, expense_amount, profit, client_name) " +
	                 "VALUES ( '" + product_name + "', '" + month_year + "', '" + 
	                 revenue_amount + "', '" + expense_amount + "', '" + profit + "', '" + client_name + "')";
	    
	    jdbcTemplate.update(sql);
	    System.out.println("Inserted revenue record: " + product_name);
	    
	    // Return latest inserted row
	    String fetchSql = "SELECT * FROM revenue ORDER BY id DESC LIMIT 1";
	    Map<String, Object> savedRecord = jdbcTemplate.queryForMap(fetchSql);
	    return savedRecord;
	}
	
	@Override
	public void update(Map<String, Object> jsonData) {
	    int id = (int) jsonData.get("id");
//	    String revenue_id = (String) jsonData.get("revenue_id");
	    String product_name = (String) jsonData.get("product_name");
	    String month_year = (String) jsonData.get("month_year");
	    String revenue_amount = String.valueOf(jsonData.get("revenue_amount"));
	    String expense_amount = String.valueOf(jsonData.get("expense_amount"));
	    String profit = String.valueOf(jsonData.get("profit"));
	    String client_name = (String) jsonData.get("client_name");
	    
	    String updateSql = "UPDATE revenue SET " +
	                       "product_name='" + product_name + "', " +
	                       "month_year='" + month_year + "', " +
	                       "revenue_amount='" + revenue_amount + "', " +
	                       "expense_amount='" + expense_amount + "', " +
	                       "profit='" + profit + "', " +
	                       "client_name='" + client_name + "' " +
	                       "WHERE id=" + id;
	    
	    jdbcTemplate.update(updateSql);
	    System.out.println("Updated revenue record with ID: " + id);
	}
	
	@Override
	public void delete(int id) {
	    String deleteSql = "DELETE FROM revenue WHERE id=" + id;
	    jdbcTemplate.update(deleteSql);
	    System.out.println("Deleted revenue record with ID: " + id);
	}
	
	@Override
	public List<Map<String, Object>> findAll() {
	    String fetchSql = "SELECT * FROM revenue ORDER BY id";
	    return jdbcTemplate.queryForList(fetchSql);
	}
}