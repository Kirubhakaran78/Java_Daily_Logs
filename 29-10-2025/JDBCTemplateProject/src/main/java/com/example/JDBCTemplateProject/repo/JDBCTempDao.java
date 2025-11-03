package com.example.JDBCTemplateProject.repo;

import java.util.List;
import java.util.Map;

import com.example.JDBCTemplateProject.pojo.JDBCTemp;

public interface JDBCTempDao {

	void saveEmp(String name, int age);

	List<JDBCTemp> fetchAllEmp();
	
	JDBCTemp fetchById(int id);

	void updateEmp(int id,String name, int age);

	void deleteEmp(int id);

	List<Map<String, Object>> fetchEmpName();

	int[] batchUpdateJdbcTemplate(List<JDBCTemp> jdbcTemp);

	

}
