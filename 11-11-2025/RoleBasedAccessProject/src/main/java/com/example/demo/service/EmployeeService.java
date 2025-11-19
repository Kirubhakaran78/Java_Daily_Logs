package com.example.demo.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.repo.EmployeeDao;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeDao repo;

    public Map<String, Object> save(Map<String, Object> jsonData) {
        return repo.save(jsonData); // return the inserted record
    }

    public List<Map<String,Object>> fetchAll() {
        return repo.findAll();
    }

    public void update(Map<String, Object> jsonData) {
        repo.update(jsonData);
    }

    public void delete(int id) {
        repo.delete(id);
    }


//    //Updated: Pass arguments to DAO
//    public List<Map<String, Object>> fetchAllWithAccess(String role, String product, boolean isActive, String empName) {
//        return repo.findAllWithAccess(role, product, isActive, empName);
//    }
}
