package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.EmployeeService;

@RestController
@CrossOrigin(origins="http://localhost:3000")
@RequestMapping("/api/masters")
public class EmployeeController {

    @Autowired
    private EmployeeService service;

    @PostMapping("/saveEmp")
    public ResponseEntity<Map<String, Object>> save(@RequestBody Map<String,Object> jsonData){
        Map<String, Object> savedUser = service.save(jsonData);
        return ResponseEntity.ok(savedUser); // Return the inserted record
    }

    @GetMapping("/getAllEmp")
    public ResponseEntity<List<Map<String,Object>>> fetchAll(){
        return ResponseEntity.ok(service.fetchAll());
    }

    @PutMapping("/updateEmp")
    public ResponseEntity<String> update(@RequestBody Map<String,Object> jsonData){
        service.update(jsonData);
        return ResponseEntity.ok("updated successfully!");
    }

    @DeleteMapping("/deleteEmp/{id}")
    public ResponseEntity<String> delete(@PathVariable int id){
        service.delete(id);
        return ResponseEntity.ok("deleted successfully!");
    }
}
