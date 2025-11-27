package com.example.demo.repo.revenue;
import java.util.List;
import java.util.Map;

public interface RevenueDao {
    Map<String, Object> save(Map<String, Object> jsonData);
    void update(Map<String, Object> jsonData);
    void delete(int id);
    List<Map<String, Object>> findAll();
    List<Map<String, Object>> getCompanyPerformance();
	List<Map<String, Object>> getProductComparison();

}