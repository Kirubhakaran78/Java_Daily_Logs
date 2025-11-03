package com.example.JDBCTemplateProject.repo;

import java.sql.ResultSet;
import java.sql.SQLException;
import org.springframework.jdbc.core.RowMapper;

import com.example.JDBCTemplateProject.pojo.JDBCTemp;

public class JDBCTempRowMapper implements RowMapper<JDBCTemp> {

	@Override
	public JDBCTemp mapRow(ResultSet rs, int rowNum) throws SQLException {
		JDBCTemp jdbcTemp= new JDBCTemp();
		jdbcTemp.setId(rs.getInt("id"));
		jdbcTemp.setName(rs.getString("name"));
		jdbcTemp.setAge(rs.getInt("age"));
		
		return jdbcTemp;
	}


}
