package com.example.demo.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
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
    
    
    @Transactional // ensures both inserts succeed/fail together
    public void register(Map<String,Object> jsonData) {
        // 1️⃣ Save into loginTable
    	repo.save(jsonData);

        // 2️⃣ Insert into employeeTable
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
}
