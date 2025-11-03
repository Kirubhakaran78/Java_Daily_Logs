package com.example.JDBCTemplateProject.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.JDBCTemplateProject.pojo.JDBCTemp;
import com.example.JDBCTemplateProject.service.JDBCTempService;


//JDBCTemplate -> spring provide "helper class" to reduce the boilerplate code 
// **handle connection, preparedstatement, Resultset automatically**
//make the code simple and clean(like , open and close,exception handling,
//datasource, handle sql and resultset)
//{spring manage this db connection using datasource configured
//in application properties converts the result}, excutes sql query
// converts ResultSet into Java Objects (using RowMapper)

//JDBCTemplate -> makes us focus business logic and sql, and reduce boilerplate code

//RowMapper -> to map each row to a java object

//helper methods:
//update() -> insert,update,delete
//query() -> select returing multiple rows
//queryForObject() -> select for returing one row,one value(aggregate funcs)
//queryForList() -> it returns a single column (eg.name),return type List<String>.
//batchUpdate(sql,batchargs[]) -> For executing multiple sql statements together(Insert,update,delete) and return the int[],
//					the elements represents how many rows were affected by each sql excution

@RestController
public class JDBCTempController {

	@Autowired
	public JDBCTempService service;
	
	//create
	@PostMapping("/saveEmp")
	public ResponseEntity<String> saveEmp(@RequestParam String name,@RequestParam int age){
		
		service.saveEmp(name,age);
		
		return ResponseEntity.ok("Saved Employee");
	}
	
	//read
	@GetMapping("/fetchAllEmp")
	public ResponseEntity<List<JDBCTemp>> fetchAllEmp(){
		
		List<JDBCTemp> list=service.fetchAllEmp();
		
		return ResponseEntity.ok(list);
	}
	
	//read one row
	@GetMapping("/fetchById")
	public ResponseEntity<JDBCTemp> fetchById(@RequestParam int id){
		
		JDBCTemp emp=service.fetchById(id);
		
		return ResponseEntity.ok(emp);
	}
	
	//read a single column
	@GetMapping("/fetchEmpName")
	public ResponseEntity<List<Map<String,Object>>> fetchEmpName(){
		
		List<Map<String,Object>> list=service.fetchEmpName();
		return ResponseEntity.ok(list);
	}
	
	//update
	@PutMapping("/updateEmp")
	public ResponseEntity<String> updateEmp(@RequestParam int id,@RequestParam String name,@RequestParam int age){
		service.updateEmp(id,name,age);
		return ResponseEntity.ok("Updated Successfully");	
	}
	
	//batch update
	@PostMapping("/batchupdate")
	public ResponseEntity<String> savejBatchUpdate(@RequestBody List<JDBCTemp> jdbcTemp){
		
		 int[] rows=service.batchUpdateJdbcTemplate(jdbcTemp);
		 return ResponseEntity.ok("Inserted : "+rows.length+" Successfully...!");
		
	}
	
	
	//delete
	@DeleteMapping("/deleteEmp")
	public ResponseEntity<String> deleteEmp(@RequestParam int id){
		service.deleteEmp(id);
		return ResponseEntity.ok("Deleted Successfully");	
	} 
	
	
	
}
