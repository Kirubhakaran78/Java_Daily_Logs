package com.example.demo.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.service.ProductService;

@RestController
@RequestMapping("/api/masters")
//@CrossOrigin(origins="http://localhost:3000")
public class ProductController {

    private final ProductService productService;

    // Constructor injection is recommended
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

   
    @GetMapping("/getAllProduct")
    public ResponseEntity<List<Map<String, Object>>> findAll() {
        List<Map<String, Object>> list = productService.fetchAll();
        return ResponseEntity.ok(list);
    }

   
    @PostMapping("/saveProduct")
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> jsonData) {
        Map<String, Object> created = productService.save(jsonData);
        return ResponseEntity.ok(created);
    }

    
    @PutMapping("/updateProduct/{id}")
    public ResponseEntity<Void> update(@PathVariable int id, @RequestBody Map<String, Object> jsonData) {
        // ensure id present in json (or set it)
        jsonData.put("id", id);
        productService.update(jsonData);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/deleteProduct/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
