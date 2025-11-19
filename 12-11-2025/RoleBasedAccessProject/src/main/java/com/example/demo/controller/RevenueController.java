package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.service.ProductService;
import com.example.demo.service.RevenueService;

@RestController
@CrossOrigin(origins="http://localhost:3000")
@RequestMapping("/api/masters")
public class RevenueController {

    @Autowired
    private RevenueService service;

    @GetMapping("/getAllRevenue")
    public ResponseEntity<List<Map<String, Object>>> getAllRevenue() {
        return ResponseEntity.ok(service.fetchAll());
    }

    @PostMapping("/saveRevenue")
    public ResponseEntity<?> saveRevenue(@RequestBody Map<String, Object> payload) {
        try {
            Map<String, Object> saved = service.save(payload);
            return ResponseEntity.ok(saved);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body("Error saving product: " + ex.getMessage());
        }
    }

    @PutMapping("/updateRevenue")
    public ResponseEntity<?> updateRevenue(@RequestBody Map<String, Object> payload) {
        try {
            service.update(payload);
            return ResponseEntity.ok("Product updated successfully");
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body("Error updating product: " + ex.getMessage());
        }
    }

    @DeleteMapping("/deleteRevenue/{id}")
    public ResponseEntity<?> deleteRevenue(@PathVariable int id) {
        try {
            service.delete(id);
            return ResponseEntity.ok("Product deleted successfully");
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body("Error deleting product: " + ex.getMessage());
        }
    }
}
