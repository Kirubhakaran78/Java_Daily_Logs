package com.example.demo.repo.post;

import com.example.demo.repo.comment.CommentDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

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
        // Handle null values properly
        String bg = (String) post.get("backgroundStyle");
        String bgValue = (bg == null || bg.isEmpty() || "null".equals(bg)) ? "NULL" : "'" + bg.replace("'", "''") + "'";
        
        String fileType = (String) post.get("fileType");
        String fileTypeValue = (fileType == null || fileType.isEmpty() || "null".equals(fileType)) ? "NULL" : "'" + fileType + "'";
        
        String postImage = (String) post.get("post_image");
        String postImageValue = (postImage == null || postImage.isEmpty() || "null".equals(postImage)) ? "NULL" : "'" + postImage + "'";

        // Font handling
        String fontFamily = (String) post.get("fontFamily");
        String fontFamilyValue = (fontFamily == null || fontFamily.isEmpty()) ? "'Segoe UI, sans-serif'" : "'" + fontFamily.replace("'", "''") + "'";
        
        String fontSize = (String) post.get("fontSize");
        String fontSizeValue = (fontSize == null || fontSize.isEmpty()) ? "'18px'" : "'" + fontSize + "'";
        
        String fontWeight = (String) post.get("fontWeight");
        String fontWeightValue = (fontWeight == null || fontWeight.isEmpty()) ? "'400'" : "'" + fontWeight + "'";
        
        String textAlign = (String) post.get("textAlign");
        String textAlignValue = (textAlign == null || textAlign.isEmpty()) ? "'left'" : "'" + textAlign + "'";
        
        String fontStyle = (String) post.get("fontStyle");
        String fontStyleValue = (fontStyle == null || fontStyle.isEmpty()) ? "'normal'" : "'" + fontStyle + "'";

        String sql =
            "INSERT INTO posts (username, profile_pic, content, file_type, post_image, background_style, " +
            "font_family, font_size, font_weight, text_align, font_style, " +
            "shares, liked, like_count, is_hidden, created_at) VALUES (" +
            "'" + post.get("username") + "'," +
            "'" + post.get("profilePic") + "'," +
            "'" + post.get("content") + "'," +
            fileTypeValue + "," +
            postImageValue + "," +
            bgValue + "," +
            fontFamilyValue + "," +
            fontSizeValue + "," +
            fontWeightValue + "," +
            textAlignValue + "," +
            fontStyleValue + "," +
            "'" + post.get("shares") + "'," +
            "'" + post.get("liked") + "'," +
            "'" + post.get("likeCount") + "'," +
            "'" + post.get("isHidden") + "'," +
            "'" + new Timestamp(System.currentTimeMillis()) + "'" +
            ") RETURNING id";

        Map<String, Object> result = jdbcTemplate.queryForMap(sql);
        Long id = ((Number) result.get("id")).longValue();
        return findById(id).orElseThrow();
    }
    
    
    @Override
    public Optional<Map<String, Object>> findById(Long id) {
        String sql = "SELECT * FROM posts WHERE id = '" + id + "'";

        List<Map<String, Object>> posts = jdbcTemplate.query(sql, (rs, rowNum) -> {
            Map<String, Object> post = new HashMap<>();
            post.put("id", rs.getLong("id"));
            post.put("profilePic", rs.getString("profile_pic"));
            post.put("username", rs.getString("username"));
            post.put("content", rs.getString("content"));
            post.put("fileType", rs.getString("file_type"));
            post.put("postImage", rs.getString("post_image"));
            post.put("backgroundStyle", rs.getString("background_style"));
            
            post.put("fontFamily", rs.getString("font_family") != null ? rs.getString("font_family") : "Segoe UI, sans-serif");
            post.put("fontSize", rs.getString("font_size") != null ? rs.getString("font_size") : "18px");
            post.put("fontWeight", rs.getString("font_weight") != null ? rs.getString("font_weight") : "400");
            post.put("textAlign", rs.getString("text_align") != null ? rs.getString("text_align") : "left");
            post.put("fontStyle", rs.getString("font_style") != null ? rs.getString("font_style") : "normal");
            
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

        if (!posts.isEmpty()) {
            Map<String, Object> post = posts.get(0);
            post.put("commentList", commentDao.findByPostId(id));
            return Optional.of(post);
        }
        return Optional.empty();
    }

    @Override
    public List<Map<String, Object>> findAll() {
        String sql =
            "SELECT * FROM posts ORDER BY created_at DESC";

        List<Map<String, Object>> posts = jdbcTemplate.query(sql, (rs, rowNum) -> {
            Map<String, Object> post = new HashMap<>();
            post.put("id", rs.getLong("id"));
            post.put("profilePic", rs.getString("profile_pic"));
            post.put("username", rs.getString("username"));
            post.put("content", rs.getString("content"));
            post.put("fileType", rs.getString("file_type"));
            post.put("postImage", rs.getString("post_image"));
            post.put("backgroundStyle", rs.getString("background_style"));
            post.put("fontFamily", rs.getString("font_family") != null ? rs.getString("font_family") : "Segoe UI, sans-serif");
            post.put("fontSize", rs.getString("font_size") != null ? rs.getString("font_size") : "18px");
            post.put("fontWeight", rs.getString("font_weight") != null ? rs.getString("font_weight") : "400");
            post.put("textAlign", rs.getString("text_align") != null ? rs.getString("text_align") : "left");
            post.put("fontStyle", rs.getString("font_style") != null ? rs.getString("font_style") : "normal");
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

        for (Map<String, Object> post : posts) {
            Long postId = (Long) post.get("id");
            post.put("commentList", commentDao.findByPostId(postId));
        }

        return posts;
    }

    @Override
    public void deleteById(Long id) {
        String sql = "DELETE FROM posts WHERE id = '" + id + "'";
        jdbcTemplate.update(sql);
    }
    
   
    // ---------- per-user like methods (parameterized and safe) ----------

    public boolean isLikeExists(Long postId, Long userId) {
        String sql = "SELECT COUNT(1) FROM post_likes WHERE post_id = ? AND user_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, postId, userId);
        return count != null && count > 0;
    }

    public void addLike(Long postId, Long userId) {
        String sql = "INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)";
        try {
            jdbcTemplate.update(sql, postId, userId);
        } catch (DataAccessException e) {
            // duplicate key or other data access issues — ignore duplicate
        }
    }

    public void removeLike(Long postId, Long userId) {
        String sql = "DELETE FROM post_likes WHERE post_id = ? AND user_id = ?";
        jdbcTemplate.update(sql, postId, userId);
    }

    public int getLikeCount(Long postId) {
        String sql = "SELECT COUNT(*) FROM post_likes WHERE post_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, postId);
        return (count == null) ? 0 : count;
    }

    public void updateLikeCountColumn(Long postId, int likeCount) {
        String sql = "UPDATE posts SET like_count = ? WHERE id = ?";
        jdbcTemplate.update(sql, likeCount, postId);
    }

    
//    @Override
//    public List<Map<String, Object>> findAllForUser(Long userId) {
//        String sql =
//            "SELECT p.id, p.profile_pic, p.username, p.content, p.file_type, p.post_image, p.background_style, p.shares, " +
//            " EXISTS(SELECT 1 FROM post_likes pl WHERE pl.post_id = p.id AND pl.user_id = ?) AS liked_by_user, " +
//            " (SELECT COUNT(*) FROM post_likes pl2 WHERE pl2.post_id = p.id) AS like_count_actual, " +
//            " p.is_hidden, p.created_at " +
//            "FROM posts p ORDER BY p.created_at DESC";
//
//        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, userId);
//        List<Map<String, Object>> result = new ArrayList<>();
//
//        for (Map<String, Object> row : rows) {
//            Map<String, Object> r = new HashMap<>();
//
//            Long postId = ((Number) row.get("id")).longValue();
//            r.put("id", postId);
//
//            // map DB columns to frontend-friendly keys
//            r.put("profilePic", row.get("profile_pic"));
//            r.put("username", row.get("username"));
//            r.put("content", row.get("content"));
//            r.put("fileType", row.get("file_type"));
//            r.put("postImage", row.get("post_image"));           // filename or null
//            r.put("backgroundStyle", row.get("background_style"));
//            r.put("fontFamily", row.get("font_family"));
//            r.put("fontSize", row.get("font_size"));
//            r.put("fontWeight", row.get("font_weight"));
//            r.put("textAlign", row.get("text_align"));
//            r.put("shares", row.get("shares") == null ? 0 : ((Number) row.get("shares")).intValue());
//            r.put("isHidden", row.get("is_hidden") == null ? false : (Boolean) row.get("is_hidden"));
//
//            // normalize liked (driver may return boolean or 0/1)
//            Object likedObj = row.get("liked_by_user");
//            boolean liked = likedObj instanceof Boolean ? (Boolean) likedObj : "1".equals(String.valueOf(likedObj));
//            r.put("liked", liked);
//
//            Number likeCntNum = (Number) row.get("like_count_actual");
//            int likeCount = likeCntNum != null ? likeCntNum.intValue() : 0;
//            r.put("likeCount", likeCount);
//
//            // createdAt mapping
//            Object createdAtObj = row.get("created_at");
//            r.put("createdAt", createdAtObj != null ? createdAtObj.toString() : null);
//
//            // comments
//            r.put("commentList", commentDao.findByPostId(postId));
//
//            result.add(r);
//        }
//        return result;
//    }
    
    
    @Override
    public List<Map<String, Object>> findAllForUser(Long userId) {
        String sql =
            "SELECT p.id, p.profile_pic, p.username, p.content, p.file_type, p.post_image, p.background_style, " +
            "p.font_family, p.font_size, p.font_weight, p.text_align,p.font_style, " + "p.shares, " +
            " EXISTS(SELECT 1 FROM post_likes pl WHERE pl.post_id = p.id AND pl.user_id = ?) AS liked_by_user, " +
            " (SELECT COUNT(*) FROM post_likes pl2 WHERE pl2.post_id = p.id) AS like_count_actual, " +
            " p.is_hidden, p.created_at " +
            "FROM posts p ORDER BY p.created_at DESC";

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, userId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Map<String, Object> row : rows) {
            Map<String, Object> r = new HashMap<>();

            Long postId = ((Number) row.get("id")).longValue();
            r.put("id", postId);

            r.put("profilePic", row.get("profile_pic"));
            r.put("username", row.get("username"));
            r.put("content", row.get("content"));
            r.put("fileType", row.get("file_type"));
            r.put("postImage", row.get("post_image"));
            r.put("backgroundStyle", row.get("background_style"));
            
            // Add defaults for null values
            r.put("fontFamily", row.get("font_family") != null ? row.get("font_family") : "Segoe UI, sans-serif");
            r.put("fontSize", row.get("font_size") != null ? row.get("font_size") : "18px");
            r.put("fontWeight", row.get("font_weight") != null ? row.get("font_weight") : "400");
            r.put("textAlign", row.get("text_align") != null ? row.get("text_align") : "left");
            r.put("fontStyle", row.get("font_style") != null ? row.get("font_style") : "normal");
            
            r.put("shares", row.get("shares") == null ? 0 : ((Number) row.get("shares")).intValue());
            r.put("isHidden", row.get("is_hidden") == null ? false : (Boolean) row.get("is_hidden"));

            Object likedObj = row.get("liked_by_user");
            boolean liked = likedObj instanceof Boolean ? (Boolean) likedObj : "1".equals(String.valueOf(likedObj));
            r.put("liked", liked);

            Number likeCntNum = (Number) row.get("like_count_actual");
            int likeCount = likeCntNum != null ? likeCntNum.intValue() : 0;
            r.put("likeCount", likeCount);

            Object createdAtObj = row.get("created_at");
            r.put("createdAt", createdAtObj != null ? createdAtObj.toString() : null);

            r.put("commentList", commentDao.findByPostId(postId));

            result.add(r);
        }
        return result;
    }

//    @Override
//    public Optional<Map<String, Object>> findByIdForUser(Long postId, Long userId) {
//        String sql =
//            "SELECT p.*, " +
//            " EXISTS(SELECT 1 FROM post_likes pl WHERE pl.post_id = p.id AND pl.user_id = ?) AS liked_by_user, " +
//            " (SELECT COUNT(*) FROM post_likes pl2 WHERE pl2.post_id = p.id) AS like_count_actual " +
//            "FROM posts p WHERE p.id = ?";
//
//        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql, userId, postId);
//        if (list.isEmpty()) return Optional.empty();
//
//        Map<String, Object> row = list.get(0);
//        Map<String, Object> r = new HashMap<>();
//
//        r.put("id", ((Number) row.get("id")).longValue());
//        r.put("profilePic", row.get("profile_pic"));
//        r.put("username", row.get("username"));
//        r.put("content", row.get("content"));
//        r.put("fileType", row.get("file_type"));
//        r.put("postImage", row.get("post_image"));
//        r.put("backgroundStyle", row.get("background_style"));
//        r.put("fontFamily", row.get("font_family"));      
//        r.put("fontSize", row.get("font_size"));          
//        r.put("fontWeight", row.get("font_weight"));     
//        r.put("textAlign", row.get("text_align")); 
//        r.put("shares", row.get("shares") == null ? 0 : ((Number) row.get("shares")).intValue());
//        r.put("isHidden", row.get("is_hidden") == null ? false : (Boolean) row.get("is_hidden"));
//
//        Object likedObj = row.get("liked_by_user");
//        boolean liked = likedObj instanceof Boolean ? (Boolean) likedObj : "1".equals(String.valueOf(likedObj));
//        r.put("liked", liked);
//
//        Number likeCntNum = (Number) row.get("like_count_actual");
//        r.put("likeCount", likeCntNum != null ? likeCntNum.intValue() : 0);
//
//        Object createdAtObj = row.get("created_at");
//        r.put("createdAt", createdAtObj != null ? createdAtObj.toString() : null);
//
//        r.put("commentList", commentDao.findByPostId(postId));
//        return Optional.of(r);
//    }

    @Override
    public Optional<Map<String, Object>> findByIdForUser(Long postId, Long userId) {
        String sql =
            "SELECT p.*, " +  // This should get all columns including font_family, font_size, etc.
            " EXISTS(SELECT 1 FROM post_likes pl WHERE pl.post_id = p.id AND pl.user_id = ?) AS liked_by_user, " +
            " (SELECT COUNT(*) FROM post_likes pl2 WHERE pl2.post_id = p.id) AS like_count_actual " +
            "FROM posts p WHERE p.id = ?";

        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql, userId, postId);
        if (list.isEmpty()) return Optional.empty();

        Map<String, Object> row = list.get(0);
        Map<String, Object> r = new HashMap<>();

        r.put("id", ((Number) row.get("id")).longValue());
        r.put("profilePic", row.get("profile_pic"));
        r.put("username", row.get("username"));
        r.put("content", row.get("content"));
        r.put("fileType", row.get("file_type"));
        r.put("postImage", row.get("post_image"));
        r.put("backgroundStyle", row.get("background_style"));
        
        // Add defaults
        r.put("fontFamily", row.get("font_family") != null ? row.get("font_family") : "Segoe UI, sans-serif");      
        r.put("fontSize", row.get("font_size") != null ? row.get("font_size") : "18px");          
        r.put("fontWeight", row.get("font_weight") != null ? row.get("font_weight") : "400");     
        r.put("textAlign", row.get("text_align") != null ? row.get("text_align") : "left"); 
        r.put("fontStyle", row.get("font_style") != null ? row.get("font_style") : " normal"); 
        
        r.put("shares", row.get("shares") == null ? 0 : ((Number) row.get("shares")).intValue());
        r.put("isHidden", row.get("is_hidden") == null ? false : (Boolean) row.get("is_hidden"));

        Object likedObj = row.get("liked_by_user");
        boolean liked = likedObj instanceof Boolean ? (Boolean) likedObj : "1".equals(String.valueOf(likedObj));
        r.put("liked", liked);

        Number likeCntNum = (Number) row.get("like_count_actual");
        r.put("likeCount", likeCntNum != null ? likeCntNum.intValue() : 0);

        Object createdAtObj = row.get("created_at");
        r.put("createdAt", createdAtObj != null ? createdAtObj.toString() : null);

        r.put("commentList", commentDao.findByPostId(postId));
        return Optional.of(r);
    }

    @Override
    public void updateHiddenStatus(Long id, Boolean isHidden) {
        String sql =
            "UPDATE posts SET is_hidden = '" + isHidden +
            "' WHERE id = '" + id + "'";
        jdbcTemplate.update(sql);
    }


}