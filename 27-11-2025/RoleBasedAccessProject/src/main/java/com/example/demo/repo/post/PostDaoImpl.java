package com.example.demo.repo.post;


import com.example.demo.repo.comment.CommentDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.*;

@Repository
public class PostDaoImpl implements PostDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private CommentDao commentDao;

    @Override
    public Map<String, Object> save(Map<String, Object> post) {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                "INSERT INTO posts (username, profile_pic, content, file_type, post_image, background_style, shares, liked, like_count, is_hidden, created_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id",
                Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, (String) post.get("username"));
            ps.setString(2, (String) post.get("profilePic"));
            ps.setString(3, (String) post.get("content"));
            ps.setString(4, (String) post.get("fileType"));
            ps.setString(5, (String) post.get("post_image"));
            ps.setString(6, (String) post.get("backgroundStyle"));
            ps.setInt(7, (Integer) post.get("shares"));
            ps.setBoolean(8, (Boolean) post.get("liked"));
            ps.setInt(9, (Integer) post.get("likeCount"));
            ps.setBoolean(10, (Boolean) post.get("isHidden"));
            ps.setTimestamp(11, new java.sql.Timestamp(System.currentTimeMillis()));
            return ps;
        }, keyHolder);

        Long id = keyHolder.getKey().longValue();

        return findById(id).orElseThrow();
    }

    @Override
    public Optional<Map<String, Object>> findById(Long id) {
        String sql = "SELECT * FROM posts WHERE id = ?";
        List<Map<String, Object>> posts = jdbcTemplate.query(sql, (rs, rowNum) -> {
            Map<String, Object> post = new HashMap<>();
            post.put("id", rs.getLong("id"));
            post.put("profilePic", rs.getString("profile_pic"));
            post.put("username", rs.getString("username"));
            post.put("content", rs.getString("content"));
            post.put("fileType", rs.getString("file_type"));
            post.put("postImage", rs.getString("post_image"));
            post.put("backgroundStyle", rs.getString("background_style"));
            post.put("shares", rs.getInt("shares"));
            post.put("liked", rs.getBoolean("liked"));
            post.put("likeCount", rs.getInt("like_count"));
            post.put("isHidden", rs.getBoolean("is_hidden"));
            
            Timestamp timestamp = rs.getTimestamp("created_at");
            if (timestamp != null) {
                post.put("createdAt", timestamp.toLocalDateTime().toString());
            }
            
            return post;
        }, id);
        
        if (!posts.isEmpty()) {
            Map<String, Object> post = posts.get(0);
            // Load comments for this post
            post.put("commentList", commentDao.findByPostId(id));
            return Optional.of(post);
        }
        
        return Optional.empty();
    }

    @Override
    public List<Map<String, Object>> findAll() {
        String sql = "SELECT * FROM posts ORDER BY created_at DESC";
        List<Map<String, Object>> posts = jdbcTemplate.query(sql, (rs, rowNum) -> {
            Map<String, Object> post = new HashMap<>();
            post.put("id", rs.getLong("id"));
            post.put("profilePic", rs.getString("profile_pic"));
            post.put("username", rs.getString("username"));
            post.put("content", rs.getString("content"));
            post.put("fileType", rs.getString("file_type"));
            post.put("postImage", rs.getString("post_image"));
            post.put("backgroundStyle", rs.getString("background_style"));
            post.put("shares", rs.getInt("shares"));
            post.put("liked", rs.getBoolean("liked"));
            post.put("likeCount", rs.getInt("like_count"));
            post.put("isHidden", rs.getBoolean("is_hidden"));
            
            Timestamp timestamp = rs.getTimestamp("created_at");
            if (timestamp != null) {
                post.put("createdAt", timestamp.toLocalDateTime().toString());
            }
            
            return post;
        });
        
        // Load comments for each post
        for (Map<String, Object> post : posts) {
            Long postId = (Long) post.get("id");
            post.put("commentList", commentDao.findByPostId(postId));
        }
        
        return posts;
    }

    @Override
    public void deleteById(Long id) {
        String sql = "DELETE FROM posts WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    @Override
    public void updateLikeStatus(Long id, Boolean liked, Integer likeCount) {
        String sql = "UPDATE posts SET liked = ?, like_count = ? WHERE id = ?";
        jdbcTemplate.update(sql, liked, likeCount, id);
    }

    @Override
    public void updateHiddenStatus(Long id, Boolean isHidden) {
        String sql = "UPDATE posts SET is_hidden = ? WHERE id = ?";
        jdbcTemplate.update(sql, isHidden, id);
    }
}