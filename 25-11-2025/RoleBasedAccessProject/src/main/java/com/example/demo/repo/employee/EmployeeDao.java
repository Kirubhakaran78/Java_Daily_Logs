package com.example.demo.repo.employee;

import java.util.List;
import java.util.Map;

public interface EmployeeDao {

    Map<String, Object> save(Map<String, Object> jsonData);

    List<Map<String, Object>> findAll();

    void update(Map<String, Object> jsonData);

    void delete(int id);

    void saveFromLogin(String username);

    Map<String, Object> findByEmail(String empEmail);

    Map<String, Object> findById(int id);

    // Dashboard / analytics
    List<Map<String, Object>> getCompanyMonthlySales();

    List<Map<String, Object>> getMonthlySalesDistribution(String productName);

    Map<String, Object> getMonthlyGrowth(String productName);

    List<Map<String, Object>> getTopClients(String productName);

    List<Map<String, Object>> getYearComparison(String productName);

    List<Map<String, Object>> getRevenueByProduct();

    List<Map<String, Object>> getProductPerformance(String productName);

    List<Map<String, Object>> getRoleDistribution();
}
