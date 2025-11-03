package com.example.JDBC_Practice.repo;

import java.sql.*;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class JDBC_CallableStatement {

	@Autowired
	public DataSource datasource;
	
	public void fetchDataFromSp(int id) {
		
		String sql="{ call get_analyst_name_ById(?) }";
		
		try(Connection con=datasource.getConnection();
				CallableStatement cb=con.prepareCall(sql);){
			
			cb.setInt(1,id);
			
			try(ResultSet rs=cb.executeQuery()){
			while(rs.next()) {
				System.out.println("Id : "+rs.getInt("id"));
				System.out.println("Name : "+rs.getString("name"));
			}
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		
	}
	
	
}
