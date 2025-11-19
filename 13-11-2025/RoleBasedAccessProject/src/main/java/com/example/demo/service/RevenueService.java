package com.example.demo.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.repo.revenue.RevenueDao;

@Service
public class RevenueService {

    @Autowired
    private RevenueDao dao;

    public Map<String, Object> save(Map<String, Object> payload){
        return dao.save(payload);
    }

    public void update(Map<String, Object> payload){
        dao.update(payload);
    }

    public List<Map<String, Object>> fetchAll(){
        return dao.findAll();
    }

    public void delete(int id){
        dao.delete(id);
    }
    
    public List<Map<String, Object>> getCompanyPerformance() {
        return dao.getCompanyPerformance();
    }
    
    public List<Map<String, Object>> getProductComparison() {
        return dao.getProductComparison();
    }
}
