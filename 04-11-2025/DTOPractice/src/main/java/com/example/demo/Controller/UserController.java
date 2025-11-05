package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Service.UserService;
import com.example.demo.pojo.User;
import com.example.demo.pojo.UserDto;

@RestController

public class UserController {
			
	
	@Autowired
	private UserService service;
	
	@PostMapping("/saveUser")
	public ResponseEntity<String> saveUser(@RequestBody User user){
		service.save(user);
		
		return ResponseEntity.ok("user saved..!");
	}
	
	
	@GetMapping("/getAllUsers")
	public ResponseEntity<List<UserDto>> getAllUsers(){
		return ResponseEntity.ok(service.getAllUsers());
	}


}
