package com.example.demo.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.repo.EmployeeDao;
import com.example.demo.repo.LoginDao;

@Service
public class LoginService {

    @Autowired
    private LoginDao repo;
    
    @Autowired
    private EmployeeDao employeeDao;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    
    @Transactional // ensures both inserts succeed/fail together
    public void register(Map<String,Object> jsonData) {
        // 1️ Save into loginTable
    	repo.save(jsonData);

        // 2️ Insert into employeeTable
        String username = (String) jsonData.get("username");
        if (username != null && !username.isEmpty()) {
            employeeDao.saveFromLogin(username);
        }
    }
    
    
//
//    public void register(Map<String, Object> jsonData) {
//        repo.save(jsonData);
//    }

    public Map<String,Object> findByUsername(String username){
        return repo.findByUsername(username);
    }

    public void updatePassword(String username, String password){
        repo.updatePassword(username, password);
    }

    public List<Map<String,Object>> fetchAll(){
        return repo.findAll();
    }
    
    
    // ✅ LOGIN METHOD with Active/Inactive check
    public Map<String, Object> login(String username, String password) {
        Map<String, Object> user = repo.findByUsername(username);

        if (user == null) {
            throw new RuntimeException("Invalid username");
        }

        if (!user.get("password").equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        // ✅ Check if user is active in employee table
        String sql = "SELECT is_active FROM employee WHERE emp_name = ? OR emp_email = ? LIMIT 1";
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, username, username);

        if (!result.isEmpty()) {
            Object isActiveObj = result.get(0).get("is_active");
            boolean isActive = (isActiveObj instanceof Boolean)
                ? (Boolean) isActiveObj
                : Boolean.parseBoolean(String.valueOf(isActiveObj));

            if (!isActive) {
                throw new RuntimeException("You need access — your account is inactive");
            }
        }

        return user; // ✅ Only return if everything passes
    }

 // ✅ New helper: check if user is active
    public boolean isUserActive(String username) {
        String sql = "SELECT is_active FROM employee WHERE emp_name = ? OR emp_email = ? LIMIT 1";
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, username, username);

        if (!result.isEmpty()) {
            Object isActiveObj = result.get(0).get("is_active");
            return (isActiveObj instanceof Boolean)
                ? (Boolean) isActiveObj
                : Boolean.parseBoolean(String.valueOf(isActiveObj));
        }

        // Default to true if no employee record found (e.g., admin user)
        return true;
    }
    
}
