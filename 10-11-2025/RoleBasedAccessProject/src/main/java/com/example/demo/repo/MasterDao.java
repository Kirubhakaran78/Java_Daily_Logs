package com.example.demo.repo;

import java.util.List;
import java.util.Map;

public interface MasterDao {
	Map<String, Object> save(Map<String, Object> jsonData);

	List<Map<String, Object>> findAll();
	
	void update(Map<String,Object> jsonData);
}
