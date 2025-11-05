package com.example;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class UtilDb {

	private static final String URL="jdbc:postgresql://localhost:5432/userdb";
	private static final String USER="postgres";
	private static final String PASSWORD="admin@123";

	public static Connection getConnection() throws SQLException {
		
		try {
			Class.forName("org.postgresql.Driver");
			
		}catch(ClassNotFoundException e) {
			e.printStackTrace();
		}
		
		
	 return DriverManager.getConnection(URL,USER,PASSWORD);
		
	}
	
}
