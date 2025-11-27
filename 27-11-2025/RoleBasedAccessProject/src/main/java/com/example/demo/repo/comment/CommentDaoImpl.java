package com.example.demo.repo.comment;

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
public class CommentDaoImpl implements CommentDao {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Override
	public Map<String, Object> save(Map<String, Object> comment) {
		String sql = "INSERT INTO comments (post_id, comment_user, text) VALUES (?, ?, ?)";

		KeyHolder keyHolder = new GeneratedKeyHolder();

		jdbcTemplate.update(connection -> {
			PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
			ps.setLong(1, ((Number) comment.get("postId")).longValue());
			ps.setString(2, (String) comment.get("user"));
			ps.setString(3, (String) comment.get("text"));
			return ps;
		}, keyHolder);

		// FIX: PostgreSQL sometimes returns multiple keys, so we pick ONLY "id"
		Map<String, Object> keys = keyHolder.getKeys();
		Long generatedId = (keys != null && keys.get("id") != null) ? ((Number) keys.get("id")).longValue() : null;

		comment.put("id", generatedId);

		return comment;
	}

	@Override
	public List<Map<String, Object>> findByPostId(Long postId) {
		String sql = "SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC";
		return jdbcTemplate.query(sql, (rs, rowNum) -> {
			Map<String, Object> comment = new HashMap<>();
			comment.put("id", rs.getLong("id"));
			comment.put("postId", rs.getLong("post_id"));
			comment.put("user", rs.getString("comment_user"));
			comment.put("text", rs.getString("text"));

			Timestamp timestamp = rs.getTimestamp("created_at");
			if (timestamp != null) {
				comment.put("createdAt", timestamp.toLocalDateTime().toString());
			}

			return comment;
		}, postId);
	}

	@Override
	public void deleteById(Long id) {
		String sql = "DELETE FROM comments WHERE id = ?";
		jdbcTemplate.update(sql, id);
	}
}