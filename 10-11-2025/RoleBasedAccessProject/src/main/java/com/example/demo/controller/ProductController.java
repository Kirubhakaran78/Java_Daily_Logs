package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



import com.example.demo.service.ProductService;

@RestController
@CrossOrigin(origins="http://localhost:3000")
@RequestMapping("/api/masters")
public class ProductController {

	
	

	@Autowired
	private ProductService service;
	
	@PostMapping("/saveProduct")
	public ResponseEntity<Map<String, Object>> save(@RequestBody Map<String,Object> jsonData){
	    Map<String, Object> savedUser = service.save(jsonData);
	    return ResponseEntity.ok(savedUser); // Return the inserted record
	}
	
	@GetMapping("/getAllProduct")
	public ResponseEntity<List<Map<String,Object>>> fetchAll(){
		return ResponseEntity.ok(service.fetchAll());
	}
	
	@PutMapping("/updateProduct")
	public ResponseEntity<String> update(@RequestBody Map<String,Object> jsonData){
		System.out.println("received");
		service.update(jsonData);
		return ResponseEntity.ok("updated successfully!");
	}
	
}
