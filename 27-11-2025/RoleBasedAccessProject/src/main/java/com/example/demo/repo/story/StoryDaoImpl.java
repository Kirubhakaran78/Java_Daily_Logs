package com.example.demo.repo.story;


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
public class StoryDaoImpl implements StoryDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    
    @Override
    public Map<String, Object> save(Map<String, Object> story) {

        String sql = "INSERT INTO stories (username, profile_pic, story_media, story_text, background_color, file_type, uploaded_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id";

        Map<String, Object> result = jdbcTemplate.queryForMap(
                sql,
                story.get("username"),
                story.get("profilePic"),
                story.get("storyMedia"),
                story.get("storyText"),
                story.get("backgroundColor"),
                story.get("fileType"),
                new Timestamp(System.currentTimeMillis())
        );

        Long id = ((Number) result.get("id")).longValue();
        story.put("id", id);

        return story;
    }


    @Override
    public List<Map<String, Object>> findAll() {
        String sql = "SELECT id, username, profile_pic as \"profilePic\", story_media as \"storyMedia\", " +
                     "story_text as \"storyText\", background_color as \"backgroundColor\", " +
                     "file_type as \"fileType\", uploaded_at as \"uploadedAt\" " +
                     "FROM stories ORDER BY uploaded_at DESC";
        return jdbcTemplate.queryForList(sql);
    }

    @Override
    public Optional<Map<String, Object>> findById(Long id) {
        String sql = "SELECT id, username, profile_pic as \"profilePic\", story_media as \"storyMedia\", " +
                     "story_text as \"storyText\", background_color as \"backgroundColor\", " +
                     "file_type as \"fileType\", uploaded_at as \"uploadedAt\" " +
                     "FROM stories WHERE id = ?";
        try {
            Map<String, Object> story = jdbcTemplate.queryForMap(sql, id);
            return Optional.of(story);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public void deleteById(Long id) {
        String sql = "DELETE FROM stories WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}
