package com.example.demo.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.repo.EmpDao;


@Service
public class EmpService {

	@Autowired
	private EmpDao repo;
	
	public void save(Map<String, Object> jsonData) {
		
		 repo.save(jsonData);
	}

	public List<Map<String,Object>> fetchAll() {
		
		return repo.findAll();
	}

}
