package com.example.demo.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.example.demo.repo.employee.EmployeeDao;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeDao repo;
    
    public Map<String, Object> save(Map<String, Object> jsonData) {
        // Step 1: Insert employee (DAO handles actual DB insert)
        Map<String, Object> saved = repo.save(jsonData);

        // Step 2: If DAO doesn't already return the full row,
        // fetch it back using emp_email (or emp_id, whichever is unique)
        if (saved == null || !saved.containsKey("id")) {
            String empEmail = (String) jsonData.get("emp_email");
            if (empEmail != null) {
                saved = repo.findByEmail(empEmail);
            }
        }

        return saved;
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

    public Map<String, Object> findById(int id) {
        return repo.findById(id);
    }


//    //Updated: Pass arguments to DAO
//    public List<Map<String, Object>> fetchAllWithAccess(String role, String product, boolean isActive, String empName) {
//        return repo.findAllWithAccess(role, product, isActive, empName);
//    }
}
