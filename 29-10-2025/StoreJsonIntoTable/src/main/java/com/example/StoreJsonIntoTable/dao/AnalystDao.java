package com.example.StoreJsonIntoTable.dao;

import java.util.List;

import com.example.StoreJsonIntoTable.pojo.Analyst;


//DAO -> Direct Database access
public interface AnalystDao {
	void save(Analyst analyst);
	
	List<Analyst> findAll();
	
	List<Analyst> findById();

	void saveByParam(String name, int age);
}
