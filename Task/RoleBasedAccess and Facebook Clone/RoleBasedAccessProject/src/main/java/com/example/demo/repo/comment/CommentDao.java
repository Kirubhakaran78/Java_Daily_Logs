package com.example.demo.repo.comment;


import java.util.List;
import java.util.Map;

public interface CommentDao {
    Map<String, Object> save(Map<String, Object> comment);
    List<Map<String, Object>> findByPostId(Long postId);
    void deleteById(Long id);
	Long findParentPostId(Long commentId);
}