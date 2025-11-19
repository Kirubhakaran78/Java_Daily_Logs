package com.example.demo.repo;

import java.util.List;
import java.util.Map;

public interface LoginDao {
    Map<String, Object> findByUsername(String username);
    void save(Map<String, Object> jsonData);
    List<Map<String, Object>> findAll();
    void updatePassword(String username, String password);
}
