package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.EmpService;

@CrossOrigin(origins="http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class EmpController {

	@Autowired
	private EmpService service;
	
	@PostMapping("/saveEmp")
	public ResponseEntity<String> save(@RequestBody Map<String,Object> jsonData){
		service.save(jsonData);
		return ResponseEntity.ok("Saved into the db");
	}
	
	@GetMapping("/fetchAllEmp")
	public ResponseEntity<List<Map<String,Object>>> fetchAll(){
		return ResponseEntity.ok(service.fetchAll());
	}
	
	
	
	
}
