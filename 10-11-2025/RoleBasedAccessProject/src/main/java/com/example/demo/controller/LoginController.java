package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.LoginService;

@RestController
@CrossOrigin(origins="http://localhost:3000")
@RequestMapping("/api/users")
public class LoginController {

	
	
	@Autowired
	private LoginService service;
	
	@PostMapping("/saveUser")
	public ResponseEntity<String> save(@RequestBody Map<String,Object> jsonData){
		service.save(jsonData);
		return ResponseEntity.ok("Login successful!");
	}
	
	@GetMapping("/fetchAllUser")
	public ResponseEntity<List<Map<String,Object>>> fetchAll(){
		return ResponseEntity.ok(service.fetchAll());
	}
	
	@PutMapping("/updateUser")
	public ResponseEntity<String> update(@RequestBody Map<String,Object> jsonData){
		System.out.println("received");
		service.update(jsonData);
		return ResponseEntity.ok("updated successfully!");
	}
}
