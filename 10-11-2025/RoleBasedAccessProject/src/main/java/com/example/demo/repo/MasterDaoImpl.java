package com.example.demo.repo;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class MasterDaoImpl implements MasterDao {

	
	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Override
	public Map<String, Object> save(Map<String, Object> jsonData) {
	    String emp_id = (String) jsonData.getOrDefault("emp_id", "101");
	    String emp_name = (String) jsonData.getOrDefault("emp_name", "John");
	    String emp_email = (String) jsonData.getOrDefault("emp_email", "john@example.com");
	    String product_name = (String) jsonData.getOrDefault("product_name","SDMS");
	    String emp_role = (String) jsonData.getOrDefault("emp_role", "Administrator");
	    String site = (String) jsonData.getOrDefault("site", "Chennai");
	    Object approveObj = jsonData.getOrDefault("approve", false);
	    String approve = String.valueOf(approveObj);

	    String sql = "INSERT INTO emp_table (emp_id, emp_name, emp_email, product_name, emp_role, site, approve) " +
	                 "VALUES ('" + emp_id + "', '" + emp_name + "', '" + emp_email + "', '" + product_name + "', '" +
	                 emp_role + "', '" + site + "', '" + approve + "')";

	    jdbcTemplate.update(sql);

	    System.out.println("Inserted record for employee: " + emp_name);

	    // return latest inserted row (if you want to refresh frontend)
	    String fetchSql = "SELECT * FROM emp_table ORDER BY id DESC LIMIT 1";
	    Map<String, Object> savedRecord = jdbcTemplate.queryForMap(fetchSql);

	    return savedRecord;
	}

	
	@Override
	public void update(Map<String, Object> jsonData) {
	    int id = (int) jsonData.get("id");
	    String emp_id = (String) jsonData.get("emp_id");
	    String emp_name = (String) jsonData.get("emp_name");
	    String emp_email = (String) jsonData.get("emp_email");
	    String product_name = (String) jsonData.get("product_name");
	    String emp_role = (String) jsonData.get("emp_role");
	    String site = (String) jsonData.get("site");
	    Object approveObj = jsonData.get("approve");
	    String approve = String.valueOf(approveObj);

	    String updateSql = "UPDATE emp_table SET " +
	                       "emp_id='" + emp_id + "', " +
	                       "emp_name='" + emp_name + "', " +
	                       "emp_email='" + emp_email + "', " +
	                       "product_name='"+product_name+"', " +
	                       "emp_role='" + emp_role + "', " +
	                       "site='" + site + "', " +
	                       "approve='" + approve + "' " +
	                       "WHERE id='" + id + "'";

	    jdbcTemplate.update(updateSql);

	    System.out.println("Updated record with ID: " + id);
	}

	
	
	@Override
	public List<Map<String, Object>> findAll() {
		String fetchSql="Select * from emp_table";
		return jdbcTemplate.queryForList(fetchSql);
	}

}
