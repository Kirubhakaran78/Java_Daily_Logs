package com.example.demo.repo.employee;

import java.util.List;
import java.util.Map;

public interface EmployeeDao {
	Map<String, Object> save(Map<String, Object> jsonData);

	List<Map<String, Object>> findAll();
	
	void update(Map<String,Object> jsonData);

	void delete(int id);

	void saveFromLogin(String username);
	
	public Map<String, Object> findByEmail(String empEmail);

	Map<String, Object> findById(int id);
	
//	List<Map<String, Object>> findAllWithAccess(String currentUserRole, String currentUserProduct, boolean isActive, String empName);

}
