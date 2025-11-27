package com.example.demo.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.repo.employee.EmployeeDao;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeDao repo;

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
