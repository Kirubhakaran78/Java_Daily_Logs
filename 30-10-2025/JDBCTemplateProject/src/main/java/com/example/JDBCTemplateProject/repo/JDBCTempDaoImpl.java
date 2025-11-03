package com.example.JDBCTemplateProject.repo;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.JDBCTemplateProject.pojo.JDBCTemp;

@Repository
public class JDBCTempDaoImpl implements JDBCTempDao  {
	
	@Autowired
	public JdbcTemplate  jdbcTemplate;

	@Override
	public void saveEmp(String name, int age) {
		String sql="Insert into jdbcTempPrac (name,age) values (?,?)";
		jdbcTemplate.update(sql,name,age);
		
	}

	@Override
	public List<JDBCTemp> fetchAllEmp() {
		return jdbcTemplate.query("Select * from jdbcTempPrac",new JDBCTempRowMapper());
		  
	}
	
	@Override
	public JDBCTemp fetchById(int id) {
		String sql="select id,name,age from jdbcTempPrac where id=?";
		return jdbcTemplate.queryForObject(sql,new JDBCTempRowMapper(),id); 
	}

	@Override
	public void updateEmp(int id,String name, int age) {
		String sql="update jdbcTempPrac set name=?,age=? where id=?";
		jdbcTemplate.update(sql,name,age,id);
	}

	@Override
	public void deleteEmp(int id) {
		String sql="delete from jdbcTempPrac where id=?";
		jdbcTemplate.update(sql,id);
	}

	
	@Override
	public List<Map<String,Object>> fetchEmpName() {
		
		//jdbcTemplate.queryForList(sql,object args[],elementType);
		//object args[] -> when we passing with parameters(optional)
		//elementType -> Type of an element to be returned
		
		//String sql="select name from jdbcTempPrac where age=?";
		//return jdbcTemplate.queryForList(sql,new Object[] {22},String.class);
		
		//to return the multiple columns need to use
		String sql2="select name,age from jdbcTempPrac";
		List<Map<String,Object>> list=jdbcTemplate.queryForList(sql2);
		return list;
	}

	@Override
	public int[] batchUpdateJdbcTemplate(List<JDBCTemp> jdbcTemp) {
		String sql="insert into jdbcTempPrac(name,age) values(?,?)";
		
		List<Object[]> batchArgs= new ArrayList<>(); //array of objects, each element is an row
		
		for(JDBCTemp s : jdbcTemp) {
			batchArgs.add(new Object[] {s.getName(),s.getAge()});
		}
		
		return jdbcTemplate.batchUpdate(sql, batchArgs);
	}

	

}
