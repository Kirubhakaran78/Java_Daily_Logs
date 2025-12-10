package com.example.demo.repo.comment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.*;

@Repository
public class CommentDaoImpl implements CommentDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public Map<String, Object> save(Map<String, Object> comment) {

        Long postId = ((Number) comment.get("postId")).longValue();
        String user = (String) comment.get("user");
        String text = (String) comment.get("text");
        Object parentIdObj = comment.get("parentCommentId");

        String parentId = (parentIdObj != null)
                ? "'" + parentIdObj.toString() + "'"
                : "NULL";

        String sql =
                "INSERT INTO comments (post_id, comment_user, text, parent_comment_id) VALUES (" +
                "'" + postId + "'," +
                "'" + user + "'," +
                "'" + text + "'," +
                     parentId +
                ") RETURNING id";

        Map<String, Object> result = jdbcTemplate.queryForMap(sql);

        Long generatedId = ((Number) result.get("id")).longValue();

        Map<String, Object> savedComment = new HashMap<>();
        savedComment.put("id", generatedId);
        savedComment.put("postId", postId);
        savedComment.put("user", user);
        savedComment.put("text", text);
        savedComment.put("parentCommentId", comment.get("parentCommentId"));

        return savedComment;
    }

    @Override
    public List<Map<String, Object>> findByPostId(Long postId) {

        String sql =
                "SELECT * FROM comments WHERE post_id='" + postId + "' ORDER BY created_at ASC";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Map<String, Object> comment = new HashMap<>();
            comment.put("id", rs.getLong("id"));
            comment.put("postId", rs.getLong("post_id"));
            comment.put("user", rs.getString("comment_user"));
            comment.put("text", rs.getString("text"));

            Object parentObj = rs.getObject("parent_comment_id");
            Long parent = (parentObj != null) ? rs.getLong("parent_comment_id") : null;

            comment.put("parentCommentId", parent);

            Timestamp timestamp = rs.getTimestamp("created_at");
            if (timestamp != null) {
                comment.put("createdAt", timestamp.toLocalDateTime().toString());
            }

            return comment;
        });
    }

    @Override
    public void deleteById(Long id) {
        String sql = "DELETE FROM comments WHERE id='" + id + "'";
        jdbcTemplate.update(sql);
    }

    @Override
    public Long findParentPostId(Long commentId) {
        String sql = "SELECT post_id FROM comments WHERE id='" + commentId + "'";
        return jdbcTemplate.queryForObject(sql, Long.class);
    }
}



//package com.example.demo.repo.comment;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.jdbc.core.JdbcTemplate;
//import org.springframework.jdbc.support.GeneratedKeyHolder;
//import org.springframework.jdbc.support.KeyHolder;
//import org.springframework.stereotype.Repository;
//
//import java.sql.PreparedStatement;
//import java.sql.Statement;
//import java.sql.Timestamp;
//import java.util.*;
//
//@Repository
//public class CommentDaoImpl implements CommentDao {
//
//    @Autowired
//    private JdbcTemplate jdbcTemplate;
//
//    @Override
//    public Map<String, Object> save(Map<String, Object> comment) {
//        String sql = "INSERT INTO comments (post_id, comment_user, text, parent_comment_id) VALUES (?, ?, ?, ?)";
//        KeyHolder keyHolder = new GeneratedKeyHolder();
//
//        jdbcTemplate.update(connection -> {
//            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
//            ps.setLong(1, ((Number) comment.get("postId")).longValue());
//            ps.setString(2, (String) comment.get("user"));
//            ps.setString(3, (String) comment.get("text"));
//            if (comment.get("parentCommentId") != null) {
//                ps.setLong(4, ((Number) comment.get("parentCommentId")).longValue());
//            } else {
//                ps.setNull(4, java.sql.Types.BIGINT);
//            }
//            return ps;
//        }, keyHolder);
//
//        Map<String, Object> keys = keyHolder.getKeys();
//        Long generatedId = (keys != null && keys.get("id") != null) 
//            ? ((Number) keys.get("id")).longValue() 
//            : null;
//
//        // CRITICAL FIX: Return data in camelCase format that frontend expects
//        Map<String, Object> savedComment = new HashMap<>();
//        savedComment.put("id", generatedId);
//        savedComment.put("postId", comment.get("postId"));
//        savedComment.put("user", comment.get("user"));
//        savedComment.put("text", comment.get("text"));
//        savedComment.put("parentCommentId", comment.get("parentCommentId"));
//
//        return savedComment;
//    }
//
//    @Override
//    public List<Map<String, Object>> findByPostId(Long postId) {
//        String sql = "SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC";
//        return jdbcTemplate.query(sql, (rs, rowNum) -> {
//            Map<String, Object> comment = new HashMap<>();
//            comment.put("id", rs.getLong("id"));
//            comment.put("postId", rs.getLong("post_id"));
//            comment.put("user", rs.getString("comment_user"));  // Map comment_user -> user
//            comment.put("text", rs.getString("text"));
//            
//            // Handle nullable parent_comment_id
//            Long parentId = rs.getObject("parent_comment_id") != null 
//                ? rs.getLong("parent_comment_id") 
//                : null;
//            comment.put("parentCommentId", parentId);  // Map parent_comment_id -> parentCommentId
//
//            Timestamp timestamp = rs.getTimestamp("created_at");
//            if (timestamp != null) {
//                comment.put("createdAt", timestamp.toLocalDateTime().toString());
//            }
//
//            return comment;
//        }, postId);
//    }
//
//    @Override
//    public void deleteById(Long id) {
//        String sql = "DELETE FROM comments WHERE id = ?";
//        jdbcTemplate.update(sql, id);
//    }
//
//    @Override
//    public Long findParentPostId(Long commentId) {
//        String sql = "SELECT post_id FROM comments WHERE id = ?";
//        return jdbcTemplate.queryForObject(sql, Long.class, commentId);
//    }
//}