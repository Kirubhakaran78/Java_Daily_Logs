package com.example.demo.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.example.demo.repo.employee.EmployeeDao;



@Service
public class EmployeeService {

    @Autowired
    private EmployeeDao repo;
    
    @Value("${server.url}")
    private String serverUrl;
    
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Value("${file.upload-dir:uploads/}")
    private String uploadDir;

    private Path fileStorageLocation;

    private void initFileStorage() {
        if (fileStorageLocation == null) {
            fileStorageLocation = Paths.get(uploadDir + "/employee-profile-pics").toAbsolutePath().normalize();
            try {
                Files.createDirectories(fileStorageLocation);
            } catch (Exception ex) {
                throw new RuntimeException("Could not create upload directory", ex);
            }
        }
    }

//    private String storeFile(MultipartFile file) {
//        initFileStorage();
//
//        String originalFileName = file.getOriginalFilename();
//        String ext = originalFileName.substring(originalFileName.lastIndexOf("."));
//        String fileName = UUID.randomUUID().toString() + ext;
//
//        try {
//            Path target = fileStorageLocation.resolve(fileName);
//            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
//
//            return ServletUriComponentsBuilder.fromCurrentContextPath()
//                    .path("/uploads/employee-profile-pics/")
//                    .path(fileName)
//                    .toUriString();
//
//        } catch (Exception e) {
//            throw new RuntimeException("File upload failed", e);
//        }
//    }



    public Map<String, Object> save(Map<String, Object> jsonData) {
        Map<String, Object> saved = repo.save(jsonData);

        if (saved == null || !saved.containsKey("id")) {
            String empEmail = (String) jsonData.get("emp_email");
            if (empEmail != null) {
                saved = repo.findByEmail(empEmail);
            }
        }

        return saved;
    }

    public List<Map<String, Object>> fetchAll() {
        return repo.findAll();
    }

    public void update(Map<String, Object> jsonData) {
        repo.update(jsonData);
    }

    public void delete(int id) {
        Map<String, Object> employee = repo.findById(id);
        if (employee != null) {
            Object isActiveObj = employee.get("is_active");
            boolean isActive = (isActiveObj instanceof Boolean)
                    ? (Boolean) isActiveObj
                    : Boolean.parseBoolean(String.valueOf(isActiveObj));

            if (isActive) {
                throw new IllegalStateException("Cannot delete active employee. Make the employee inactive first.");
            }
        }
        repo.delete(id);
    }
    
    
    
   

    public String uploadProfilePic(Long id, MultipartFile file) throws IOException {

        // Store file
        Path uploadPath = Paths.get("uploads").toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        String fileName = "profile_" + id + "_" + System.currentTimeMillis() + ".jpg";
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        //String fileUrl = "http://localhost:8082/Org_Management_java/uploads/" + fileName;
        String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(fileName)
                .toUriString();


//        return fileUrl;
        // *** UPDATE DB using JDBC ***
        repo.updateProfilePic(id, fileUrl);

        return fileUrl;
    }


    public String getProfilePicture(Long id) {
        return repo.getProfilePic(id);
    }

    public Map<String, Object> findById(int id) {
        return repo.findById(id);
    }

    // Dashboard / analytics methods

    public List<Map<String, Object>> getRoleDistribution() {
        return repo.getRoleDistribution();
    }

    public List<Map<String, Object>> getRevenueByProduct() {
        return repo.getRevenueByProduct();
    }

    public List<Map<String, Object>> getProductPerformance(String productName) {
        return repo.getProductPerformance(productName);
    }

    public List<Map<String, Object>> getYearComparison(String productName) {
        return repo.getYearComparison(productName);
    }

    public List<Map<String, Object>> getTopClients(String productName) {
        return repo.getTopClients(productName);
    }

    public Map<String, Object> getMonthlyGrowth(String productName) {
        return repo.getMonthlyGrowth(productName);
    }

    public List<Map<String, Object>> getMonthlySalesDistribution(String productName) {
        return repo.getMonthlySalesDistribution(productName);
    }

    public List<Map<String, Object>> getCompanyMonthlySales() {
        return repo.getCompanyMonthlySales();
    }
}
