package com.example.demo.repo.product;

import java.util.List;
import java.util.Map;

public interface ProductDao {
    Map<String, Object> save(Map<String, Object> jsonData);
    void update(Map<String, Object> jsonData);
    void delete(int id);
    List<Map<String, Object>> findAll();
}
