package com.example.StoreJsonIntoTable.service;

import java.sql.*;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.StoreJsonIntoTable.dao.AnalystDao;
import com.example.StoreJsonIntoTable.pojo.Analyst;

@Service
public class AnalystService {


	
	@Autowired
	private AnalystDao analystDao;
	// When you create this class (like AnalystService), 
	// automatically give me an object that implements AnalystDao
	
	public void saveAnalyst(Analyst analyst) {
		analystDao.save(analyst);
	}
	
	public void saveAnalystHasParam(String name,int age){
		analystDao.saveByParam(name,age);
	}
	
	
	public List<Analyst> getAllAnalyst() {
		return analystDao.findAll();
	}
	
	public List<Analyst> getAnalystById(){
		return analystDao.findById();
	}
	
}
