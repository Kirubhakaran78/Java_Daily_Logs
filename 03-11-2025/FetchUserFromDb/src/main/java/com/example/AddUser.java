package com.example;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

//@WebServlet("/user)
public class AddUser extends HttpServlet {

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

		response.setContentType("text/html");

		String name = request.getParameter("name");
		int age = Integer.parseInt(request.getParameter("age"));

		try (Connection con = UtilDb.getConnection()) {
			String sql = "Insert into usertable (name,age) values(?,?)";

			PreparedStatement ps = con.prepareStatement(sql);

			ps.setString(1, name);
			ps.setInt(2, age);

			int rows = ps.executeUpdate();

			if (rows > 0) {
				response.getWriter().println("User updated to Db");
			} else {
				response.getWriter().println("User updated to Db");
			}

		} catch (SQLException e) {

			e.printStackTrace();
			response.getWriter().println("<h2 style='color: red;'> Database error: " + e.getMessage() + "</h2>");

		}

	}

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		
		response.setContentType("text/html");
		
		try(Connection con=UtilDb.getConnection()){
			String sql="Select * from usertable";
			
				PreparedStatement ps=con.prepareStatement(sql);
				
				
				ResultSet rs=ps.executeQuery();
				
				response.getWriter().println("user details: ");
				response.getWriter().println("<table border='2' cellpadding='5'>");
				response.getWriter().println("<tr><th>Name</th><th>Age</th></tr>");
						
				while(rs.next()) {
					response.getWriter().println("<tr>");
					response.getWriter().println("<td>"+ rs.getString("name")+"</td>");
					response.getWriter().println("<td>"+ rs.getInt("age")+"</td>");
					response.getWriter().println("</tr>");
				}
				
				response.getWriter().println("</table>");
			
		} catch (SQLException e) {
			e.printStackTrace();
			response.getWriter().println("<h2 style='color: red;'> Database error: " + e.getMessage() + "</h2>");
		}
	}

}
