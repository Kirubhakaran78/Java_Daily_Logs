package com.example.demo.repo.post;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface PostDao {
    Map<String, Object> save(Map<String, Object> post);
    Optional<Map<String, Object>> findById(Long id);
    List<Map<String, Object>> findAll();
    void deleteById(Long id);
    void updateLikeStatus(Long id, Boolean liked, Integer likeCount);
    void updateHiddenStatus(Long id, Boolean isHidden);
}