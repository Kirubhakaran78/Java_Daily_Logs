package com.example.demo.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.repo.employee.EmployeeDao;
import com.example.demo.repo.login.LoginDao;

@Service
public class LoginService {

    @Autowired
    private LoginDao repo;
    
    @Autowired
    private EmployeeDao employeeDao;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Transactional
    public void register(Map<String,Object> jsonData) {
        repo.save(jsonData);
        String username = (String) jsonData.get("username");
        if (username != null && !username.isEmpty()) {
            employeeDao.saveFromLogin(username);
        }
    }

    public Map<String,Object> findByUsername(String username){
        return repo.findByUsername(username);
    }

    public void updatePassword(String username, String password){
        repo.updatePassword(username, password);
    }

    public List<Map<String,Object>> fetchAll(){
        return repo.findAll();
    }
    
    // ✅ OPTIONAL: Keep this helper if you need it elsewhere
    public boolean isUserActive(String username) {
        String sql = "SELECT is_active FROM employee WHERE emp_name = ? OR emp_email = ? LIMIT 1";
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, username, username);

        if (!result.isEmpty()) {
            Object isActiveObj = result.get(0).get("is_active");
            return (isActiveObj instanceof Boolean)
                ? (Boolean) isActiveObj
                : Boolean.parseBoolean(String.valueOf(isActiveObj));
        }
        return true;
    }
}
