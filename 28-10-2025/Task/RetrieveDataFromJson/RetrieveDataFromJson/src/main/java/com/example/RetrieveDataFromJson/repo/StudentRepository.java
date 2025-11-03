//package com.example.RetrieveDataFromJson.repo;
//
//import java.sql.Connection;
//import java.sql.PreparedStatement;
//import java.sql.ResultSet;
//
//import javax.sql.DataSource;
//
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Repository;
//
//@Repository
//public class StudentRepository {
//
//	@Autowired
//	private DataSource datasource;
//	
//	public void insertStudent(int id,String name) {
//		
//		String sql="INSERT into studentsTable4 (id,name) VALUES (?,?)";
//		
//		try(Connection con=datasource.getConnection();
//				PreparedStatement ps=con.prepareStatement(sql)){
//			
//			ps.setInt(1,id);
//			ps.setString(2,name);
//			
//			ps.executeUpdate(); //Executes the SQL query (like INSERT, UPDATE, or DELETE).
//			System.out.println("Student executed Successfully");
//			
//		}catch(Exception e) {
//			e.printStackTrace();
//		}
//		
//	}
//	
//	
//	public void fetchStudent() {
//		
//		String sqlFetch="SELECT * from studentsTable4";
//		
//		try(Connection con=datasource.getConnection();
//				PreparedStatement ps=con.prepareStatement(sqlFetch);
//				ResultSet rs=ps.executeQuery()){
//			
//			while(rs.next()) {
//				System.out.println(rs.getInt("id")+" -> "+rs.getString("name"));
//			}
//			
//		}catch(Exception e) {
//			e.printStackTrace();
//		}
//	}
//
//}
