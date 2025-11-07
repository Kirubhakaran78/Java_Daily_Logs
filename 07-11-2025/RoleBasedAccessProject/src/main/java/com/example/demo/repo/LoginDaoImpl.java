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
	public void save(Map<String, Object> jsonData) {// json -> map
		
		//use the jsonData.get("name") or this getOrDefault("name","unknownName")
		String username = (String) jsonData.getOrDefault("username","admin");//map return object type so cast to string
		String password = (String) jsonData.getOrDefault("password","admin");

			String insertSql = "Insert into loginTable(username,password) values ('"+username+"','"+password+"')";

			jdbcTemplate.update(insertSql);

			System.out.println("Saved new record : " + username);
		}

	@Override
	public void update(Map<String, Object> jsonData) {
		String username = (String) jsonData.getOrDefault("username","admin");
		String password = (String) jsonData.getOrDefault("password","admin");
		
		String updateSql = "update loginTable set password='"+password+"' where username='"+username+"')";
		
		jdbcTemplate.update(updateSql);
	}	
	
	@Override
	public List<Map<String, Object>> findAll() {
		String fetchSql="Select * from loginTable";
		return jdbcTemplate.queryForList(fetchSql);
	}

	
	
}
