package com.example.demo.repo;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ProductDaoImpl implements ProductDao {

	
	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Override
	public Map<String, Object> save(Map<String, Object> jsonData) {
		String product_id = (String) jsonData.getOrDefault("product_id","000");
	    String product_name = (String) jsonData.getOrDefault("product_name", "Default product_name");
	    String budget_per_annum = (String) jsonData.getOrDefault("budget_per_annum", "0");
	    String total_employees = (String) jsonData.getOrDefault("total_employees","0");
	   

	    String sql = "INSERT INTO product_table (product_id, product_name, budget_per_annum, total_employees) " +
	                 "VALUES ('" + product_id + "', '" + product_name + "', '" + budget_per_annum + "', '" + total_employees + "')";

	    jdbcTemplate.update(sql);

	    System.out.println("Inserted record for Product: " + product_name);

	    // return latest inserted row (if you want to refresh frontend)
	    String fetchSql = "SELECT * FROM product_table ORDER BY id DESC LIMIT 1";
	    Map<String, Object> savedRecord = jdbcTemplate.queryForMap(fetchSql);

	    return savedRecord;
	}

	
	@Override
	public void update(Map<String, Object> jsonData) {
	    int id = (int) jsonData.get("id");
	    String product_id = (String) jsonData.getOrDefault("product_id", "000");
	    String product_name = (String) jsonData.getOrDefault("product_name", "Default product_name");
	    String budget_per_annum = (String) jsonData.getOrDefault("budget_per_annum", "0");
	    String total_employees = (String) jsonData.getOrDefault("total_employees","0");

	    String updateSql = "UPDATE product_table SET " +
	                       "product_id='" + product_id + "', " +
	                       "product_name='" + product_name + "', " +
	                       "budget_per_annum='" + budget_per_annum + "', " +
	                       "total_employees='"+total_employees+"' ";
	                       

	    jdbcTemplate.update(updateSql);

	    System.out.println("Updated record with ID: " + id);
	}

	
	
	@Override
	public List<Map<String, Object>> findAll() {
		String fetchSql="Select * from product_table";
		return jdbcTemplate.queryForList(fetchSql);
	}

}
