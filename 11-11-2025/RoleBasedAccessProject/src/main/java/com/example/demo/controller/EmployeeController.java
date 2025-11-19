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

import jakarta.servlet.http.HttpSession;

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
    
 // Updated: role-based and is_active filter
//    @GetMapping("/getAllEmp")
//    public ResponseEntity<List<Map<String, Object>>> fetchAll(HttpSession session) {
//        // Get current user from session
//        Map<String, Object> currentUser = (Map<String, Object>) session.getAttribute("currentUser");
//
//        if (currentUser == null) {
//            return ResponseEntity.status(401).build(); // Unauthorized
//        }
//
//        String role = (String) currentUser.get("role");
//        String product = (String) currentUser.get("product_name");
//        boolean isActive = Boolean.TRUE.equals(currentUser.get("is_active"));
//        String empName = (String) currentUser.get("emp_name");
//
//        List<Map<String, Object>> employees = service.fetchAllWithAccess(role, product, isActive, empName);
//        return ResponseEntity.ok(employees);
//    }

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
