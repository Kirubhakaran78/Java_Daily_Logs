package com.example.JDBC_Practice.repo;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

//Driver -> acts as a bridge between your java application and a specific database(like pgsql..)
// it translates the sql query written in java to an native db language

@Repository
public class JdbcRepository {

	// DriverManager(create new connection and it will be slow)
	// we use the DataSource(it gives ready to use connection from the pool(not creating one from the stratch)
	// it will auto-configures connection pool(using HikariCP by default)
	// reads from the application properties, it creates and manage reusable database connections
	
	//You keep 10 tables ready. When customers come, they sit. 
	//When they leave, you clean the table — ready for the next.
	@Autowired
	public DataSource datasource;
	
	public void insertAnalyst(int id,String name) {
		String sql="INSERT INTO analystTable (id,name) VALUES (?,?)";
		
		try(Connection con=datasource.getConnection();
				PreparedStatement ps=con.prepareStatement(sql)){
			
			ps.setInt(1,id); //parameter 1
			ps.setString(2,name);
			ps.executeUpdate(); //Execute Insert,Update, Delete	
			
			System.out.println("Inserted successfully...!");
			
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	
	public void fetchAnalyst() {
		
		
		String sqlFetch="SELECT * FROM analystTable";
		
		//we are using try-with-resources from java-7 -> to automatically close without using the finally con.close();
		try(Connection con=datasource.getConnection();
				PreparedStatement ps=con.prepareStatement(sqlFetch);
				ResultSet rs=ps.executeQuery();){
			
			while(rs.next()) {
				System.out.println(rs.getInt("id")+" -> "+rs.getString("name"));
			}
			
			
			
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	

}
