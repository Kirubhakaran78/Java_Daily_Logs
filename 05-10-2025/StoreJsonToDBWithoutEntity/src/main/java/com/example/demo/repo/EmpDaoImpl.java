package com.example.demo.repo;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.databind.ObjectMapper;

@Repository
public class EmpDaoImpl implements EmpDao {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private ObjectMapper mapper; // for converting the map to json string

	@Override
	public void save(Map<String, Object> jsonData) {// json -> map
		
		//use the jsonData.get("name") or this getOrDefault("name","unknownName")
		String name = (String) jsonData.getOrDefault("name","unknown name");//map return object type so cast to string
		int age = (int) jsonData.getOrDefault("age",0);
		String email = (String) jsonData.getOrDefault("email","noemail@gmail.com");

		String checkSql = "select count(*) from emp_data where email='"+email+"'";
		Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class);

		if (count != null && count > 0) {
			String updateSql = "update emp_data set name='"+name+"',age='"+age+"' where email='"+email+"'";

			jdbcTemplate.update(updateSql);

			System.out.println("Updated existing record for: " + email);

		} else {
			String insertSql = "Insert into emp_data(name,age,email) values ('"+name+"','"+age+"','"+email+"')";

			jdbcTemplate.update(insertSql);

			System.out.println("Saved new record : " + email);
		}

	}

	@Override
	public List<Map<String, Object>> findAll() {
		String fetchSql="Select * from emp_data";
		return jdbcTemplate.queryForList(fetchSql);
	}

	// saving the json data has an string in one column
//	@Override
//	public void save(Map<String, Object> jsonData) {
//
//		try {
//			// convert the json object to string
//			String jsonString = mapper.writeValueAsString(jsonData);
//
//			String sql = "Insert into json_data(data) values (cast(? as JSONB))";
//			jdbcTemplate.update(sql, jsonString);
//
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//
//	}

}
