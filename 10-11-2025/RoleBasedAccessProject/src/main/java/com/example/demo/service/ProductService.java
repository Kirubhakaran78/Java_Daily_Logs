package com.example.demo.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;


import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.example.demo.repo.ProductDao;

@Service

public class ProductService {

	@Autowired
	private ProductDao repo;
	
	public Map<String, Object> save(Map<String, Object> jsonData) {
	    return repo.save(jsonData); // return the record
	}


	public List<Map<String,Object>> fetchAll() {
		
		return repo.findAll();
	}
	
	public void update(Map<String, Object> jsonData) {
		
		 repo.update(jsonData);
	}
}
