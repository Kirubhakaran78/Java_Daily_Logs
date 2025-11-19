package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
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
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/getRoleDistribution")
    public List<Map<String, Object>> getRoleDistribution() {
        String sql = "SELECT emp_role AS role, COUNT(*) AS count FROM employee GROUP BY emp_role";
        return jdbcTemplate.queryForList(sql);
    }
    


    @PostMapping("/saveEmp")
    public ResponseEntity<Map<String, Object>> save(@RequestBody Map<String, Object> jsonData) {
        // Save employee and return the full record
        Map<String, Object> savedEmployee = service.save(jsonData);

        if (savedEmployee == null || savedEmployee.isEmpty()) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Employee could not be saved"));
        }

        // Return the inserted employee record
        return ResponseEntity.ok(savedEmployee);
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
    	
    	// 1️.Get employee details
        Map<String, Object> employee = service.findById(id);

        // 2️.Check active status
        boolean isActive = (boolean) employee.get("is_active");

        if (isActive) {
            return ResponseEntity.badRequest().body("Cannot delete active employee. Make the employee inactive first.");
        }

        // 3️.Delete if inactive
        service.delete(id);
        return ResponseEntity.ok("deleted successfully!");
    }
}
