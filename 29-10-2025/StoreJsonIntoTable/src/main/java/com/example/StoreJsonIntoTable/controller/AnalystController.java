package com.example.StoreJsonIntoTable.controller;

import java.util.*;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.StoreJsonIntoTable.pojo.Analyst;
import com.example.StoreJsonIntoTable.service.AnalystService;

@RestController
public class AnalystController {

	//inject the DAO dependency -so the service can call DAO methods 
	//without manually creating the DAO object.
	@Autowired
	public AnalystService analystService;
	
	
	//@RequestParam -> gets value from the "url query string" or "form data" of an http request
	@PostMapping("/saveByParams")
	public ResponseEntity<String> saveByParams(@RequestParam String name,@RequestParam int age){
		analystService.saveAnalystHasParam(name,age);
		return ResponseEntity.ok("saved by params successfully");
		
	}
	
	@PostMapping("/saveInTable")
	//ResponseEntity<String> is a wrapper,
	//spring boot sends a custom Http response
	public ResponseEntity<String> save(@RequestBody Analyst analyst) {
		analystService.saveAnalyst(analyst);
		
//		List<Integer> list=new ArrayList<>();
//		list.add(1);
//		list.add(2);
//		list.add(2);
//		list.add(3);
//		list.add(3);
//		
//		Set<List<Integer>> set=new HashSet<>();
//		
//		List<Integer> uniqueList=new ArrayList<>(); 
//		set.add(list);

//		Iterator<Integer> it=list.iterator();
		
//		while(it.hasNext()) {
//			Integer i=it.next();
//			set.add(i);
//		}
		//return ResponseEntity.ok(set);
		
		return ResponseEntity.ok("Student saved successfully");
	}
	
	@GetMapping("/fetchAll")
	public ResponseEntity<List<Analyst>> fetch(){
		
		List<Analyst> analysts=analystService.getAllAnalyst();

		return ResponseEntity.ok(analysts);
	}
	
	@GetMapping("/getById")
	public ResponseEntity<List<Analyst>> getById(){
		List<Analyst> analysts=analystService.getAnalystById();
		
		return ResponseEntity.ok(analysts);
	}

}
