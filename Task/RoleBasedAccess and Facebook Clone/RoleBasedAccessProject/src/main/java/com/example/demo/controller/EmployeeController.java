package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.service.EmployeeService;

@RestController
//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/masters")
public class EmployeeController {

    @Autowired
    private EmployeeService service;

    // ROLE DISTRIBUTION
    @GetMapping("/getRoleDistribution")
    public List<Map<String, Object>> getRoleDistribution() {
        return service.getRoleDistribution();
    }

    // Revenue Distribution by Product (Admin)
    @GetMapping("/getRevenueByProduct")
    public List<Map<String, Object>> getRevenueByProduct() {
        return service.getRevenueByProduct();
    }

    // Product Performance Timeline (Manager/Employee)
    @GetMapping("/getProductPerformance")
    public List<Map<String, Object>> getProductPerformance(@RequestParam String productName) {
        return service.getProductPerformance(productName);
    }

    // Year-over-Year Sales Comparison (Manager/Employee)
    @GetMapping("/getYearComparison")
    public List<Map<String, Object>> getYearComparison(@RequestParam String productName) {
        return service.getYearComparison(productName);
    }

    // Top 5 Clients (Manager/Employee)
    @GetMapping("/getTopClients")
    public List<Map<String, Object>> getTopClients(@RequestParam String productName) {
        return service.getTopClients(productName);
    }

    // Monthly Growth Percentage (Manager/Employee KPI)
    @GetMapping("/getMonthlyGrowth")
    public Map<String, Object> getMonthlyGrowth(@RequestParam String productName) {
        return service.getMonthlyGrowth(productName);
    }

    // Monthly Sales Distribution (Manager/Employee)
    @GetMapping("/getMonthlySalesDistribution")
    public List<Map<String, Object>> getMonthlySalesDistribution(@RequestParam String productName) {
        return service.getMonthlySalesDistribution(productName);
    }

    // Company-wide Monthly Sales (Admin)
    @GetMapping("/getCompanyMonthlySales")
    public List<Map<String, Object>> getCompanyMonthlySales() {
        return service.getCompanyMonthlySales();
    }

    // Save Employee
    @PostMapping("/saveEmp")
    public ResponseEntity<Map<String, Object>> save(@RequestBody Map<String, Object> jsonData) {
        Map<String, Object> savedEmployee = service.save(jsonData);

        if (savedEmployee == null || savedEmployee.isEmpty()) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Employee could not be saved"));
        }

        return ResponseEntity.ok(savedEmployee);
    }

    // Get All Employees
    @GetMapping("/getAllEmp")
    public ResponseEntity<List<Map<String, Object>>> fetchAll() {
        return ResponseEntity.ok(service.fetchAll());
    }

    // Update Employee
    @PutMapping("/updateEmp")
    public ResponseEntity<String> update(@RequestBody Map<String, Object> jsonData) {
        service.update(jsonData);
        return ResponseEntity.ok("updated successfully!");
    }

    // Delete Employee (with business rule: cannot delete active employee)
    @DeleteMapping("/deleteEmp/{id}")
    public ResponseEntity<String> delete(@PathVariable int id) {
        try {
            service.delete(id);
            return ResponseEntity.ok("deleted successfully!");
        } catch (IllegalStateException ex) {
            // business rule violation
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body("Error deleting employee");
        }
    }
    
    @PostMapping("/{id}/upload-profile")
    public ResponseEntity<String> uploadPic(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        try {
            String url = service.uploadProfilePic(id, file);
            return ResponseEntity.ok(url);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }


    @GetMapping("/{id}/profile-pic")
    public ResponseEntity<?> getProfilePic(@PathVariable Long id) {
        String url = service.getProfilePicture(id);

        return ResponseEntity.ok(Map.of("url", url));
    }
    
    
//    @PostMapping("/employee/{id}/upload-profile")
//    public ResponseEntity<?> uploadProfilePic(
//            @PathVariable String id,
//            @RequestParam("file") MultipartFile file) {
//
//        try {
//            String fileUrl = service.uploadProfilePic(id, file);
//
//            return ResponseEntity.ok(
//                    Map.of(
//                            "message", "Profile picture uploaded successfully",
//                            "url", fileUrl
//                    )
//            );
//
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
//        }
//    }

}
