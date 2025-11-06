package com.example.demo.repo;

import java.util.List;
import java.util.Map;

public interface EmpDao {

	void save(Map<String, Object> jsonData);

	List<Map<String, Object>> findAll();

}
