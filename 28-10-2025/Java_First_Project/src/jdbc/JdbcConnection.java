package jdbc;

import java.sql.*;


// DriverJava -> class that connects your app to a database
// Class.forName(...) -> Loads(memory) and registers the driver(JDBC API )
// DriverManager -> Uses the driver to create a connection

public class JdbcConnection {

	public static void main(String[] args) throws ClassNotFoundException {
		
		String url="jdbc:postgresql://localhost:5432/studentdb";
		String user="postgres";
		String pass="admin@123";
		
		String query="";
		
		try {
			//1. Load and register the jdbc driver
			Class.forName("org.postgresql.Driver");
			
			//2. Establish Connection
			Connection con= DriverManager.getConnection(url,user,pass);
			
			//3. create Statement
			Statement stm=con.createStatement();
			
			//4. execute Query
			ResultSet rs=stm.executeQuery(query);
			
			//5. process the result
			while(rs.next()) {
				System.out.println(rs.getInt("id")+" - "+rs.getString("name"));
			}
			
			//6. close connection
			con.close();
			
			
		}catch(SQLException e) {
			e.printStackTrace();
		}

	}

}
