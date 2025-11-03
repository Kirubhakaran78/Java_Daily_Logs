package com.example.JDBCTemplateProject.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.JDBCTemplateProject.pojo.JDBCTemp;
import com.example.JDBCTemplateProject.repo.JDBCTempDao;

@Service
public class JDBCTempService {

	@Autowired
	public JDBCTempDao dao;

	public void saveEmp(String name, int age) {
		dao.saveEmp(name, age);

	}

	public List<JDBCTemp> fetchAllEmp() {
		return dao.fetchAllEmp();
	}

	public JDBCTemp fetchById(int id) {

		return dao.fetchById(id);
	}

	public void updateEmp(int id,String name, int age) {
		dao.updateEmp(id,name, age);
	}

	public void deleteEmp(int id) {
		dao.deleteEmp(id);

	}

	public List<Map<String,Object>> fetchEmpName() {
		return dao.fetchEmpName();
	}

	public int[] batchUpdateJdbcTemplate(List<JDBCTemp> jdbcTemp) {
		
		return dao.batchUpdateJdbcTemplate(jdbcTemp);
	}

}
