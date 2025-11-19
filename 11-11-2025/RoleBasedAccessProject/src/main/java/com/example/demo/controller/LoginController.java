package com.example.demo.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.service.LoginService;

@RestController
@CrossOrigin(origins="http://localhost:3000")
@RequestMapping("/api/users")
public class LoginController {

    @Autowired
    private LoginService service;

    // register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String,Object> jsonData){
        try {
            service.register(jsonData);
            return ResponseEntity.ok("User registered");
        } catch(Exception ex){
            ex.printStackTrace();
            return ResponseEntity.status(500).body("Error registering: " + ex.getMessage());
        }
    }

//    // login - returns user row or 401 (original)
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody Map<String,Object> jsonData){
//        String username = (String) jsonData.get("username");
//        String password = (String) jsonData.get("password");
//        try {
//            Map<String,Object> user = service.findByUsername(username);
//            if(user == null) return ResponseEntity.status(401).body("Invalid username or password");
//            String pw = (String) user.get("password");
//            if(pw != null && pw.equals(password)){
//                // hide password before returning
//                user.remove("password");
//                return ResponseEntity.ok(user);
//            } else {
//                return ResponseEntity.status(401).body("Invalid username or password");
//            }
//        } catch(Exception ex){
//            ex.printStackTrace();
//            return ResponseEntity.status(500).body("Error logging in: " + ex.getMessage());
//        }
//    }
    
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,Object> jsonData){
        String username = (String) jsonData.get("username");
        String password = (String) jsonData.get("password");
        try {
            Map<String,Object> user = service.findByUsername(username);
            if(user == null) return ResponseEntity.status(401).body("Invalid username or password");

            String pw = (String) user.get("password");
            if(pw != null && pw.equals(password)){

                // ✅ Check if user is active
                boolean isActive = service.isUserActive(username);
                if (!isActive) {
                    return ResponseEntity.status(403).body("Your account is inactive. Please contact admin.");
                }

                // hide password before returning
                user.remove("password");
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(401).body("Invalid username or password");
            }
        } catch(Exception ex){
            ex.printStackTrace();
            return ResponseEntity.status(500).body("Error logging in: " + ex.getMessage());
        }
    }


    @PutMapping("/updateUser")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String,Object> jsonData){
        try {
            String username = (String) jsonData.get("username");
            String password = (String) jsonData.get("password");
            service.updatePassword(username, password);
            return ResponseEntity.ok("updated successfully!");
        } catch(Exception ex){
            ex.printStackTrace();
            return ResponseEntity.status(500).body("Error updating user: " + ex.getMessage());
        }
    }
    
    @GetMapping("/checkUsername/{username}")
    public ResponseEntity<?> checkUsername(@PathVariable String username){
        try {
            Map<String,Object> user = service.findByUsername(username);
            boolean exists = (user != null);
            return ResponseEntity.ok(Map.of("exists", exists));
        } catch(Exception ex){
            ex.printStackTrace();
            return ResponseEntity.status(500).body("Error checking username");
        }
    }
    
    
    @GetMapping("/currentUser")
    public ResponseEntity<?> getCurrentUser(@RequestParam String username){
        try {
            Map<String,Object> user = service.findByUsername(username);
            if(user != null) {
                user.remove("password"); // hide password
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(404).body("User not found");
            }
        } catch(Exception ex){
            ex.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching user");
        }
    }
    
//    
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
//        try {
//            String username = payload.get("username");
//            String password = payload.get("password");
//            Map<String, Object> user = service.login(username, password);
//            return ResponseEntity.ok(user);
//        } catch (RuntimeException e) {
//            return ResponseEntity.status(403).body(e.getMessage());
//        }
//    }


}
