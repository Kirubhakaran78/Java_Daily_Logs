//package com.example.demo.repo.post;
//
//import java.util.List;
//import java.util.Map;
//import java.util.Optional;
//
//public interface PostDao {
//    Map<String, Object> save(Map<String, Object> post);
//    Optional<Map<String, Object>> findById(Long id);
//    List<Map<String, Object>> findAll();
//    void deleteById(Long id);
//    void updateLikeStatus(Long id, Boolean liked, Integer likeCount);
//    void updateHiddenStatus(Long id, Boolean isHidden);
//}

package com.example.demo.repo.post;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface PostDao {

    // ---------- BASIC CRUD ----------
    Map<String, Object> save(Map<String, Object> post);
    Optional<Map<String, Object>> findById(Long id);
    List<Map<String, Object>> findAll();
    void deleteById(Long id);

    // ---------- HIDDEN TOGGLE ----------
    void updateHiddenStatus(Long id, Boolean isHidden);

    // ---------- PER-USER LIKE SYSTEM ----------
    boolean isLikeExists(Long postId, Long userId);
    void addLike(Long postId, Long userId);
    void removeLike(Long postId, Long userId);

    int getLikeCount(Long postId);       // always compute fresh from post_likes table
    void updateLikeCountColumn(Long postId, int likeCount); // optional cache column

    // ---------- USER-AWARE FETCH ----------
    List<Map<String, Object>> findAllForUser(Long userId);
    Optional<Map<String, Object>> findByIdForUser(Long postId, Long userId);
}
