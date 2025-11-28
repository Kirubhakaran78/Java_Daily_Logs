package com.example.demo.repo.story;


import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface StoryDao {
    Map<String, Object> save(Map<String, Object> story);
    List<Map<String, Object>> findAll();
    Optional<Map<String, Object>> findById(Long id);
    void deleteById(Long id);
}