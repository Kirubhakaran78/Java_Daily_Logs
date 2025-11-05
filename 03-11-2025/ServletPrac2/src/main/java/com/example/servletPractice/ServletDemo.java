package com.example.servletPractice;

import java.io.IOException;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

//@WebServlet("/hello")
public class ServletDemo extends HttpServlet{

	@Override
	public void doGet(HttpServletRequest request,HttpServletResponse response) throws IOException {
		response.setContentType("text/html");
		
		
		response.getWriter().println("<h2>Hello form the servlet demo..!</h2>");
		
	}
	
	@Override
	public void doPost(HttpServletRequest request,HttpServletResponse response) throws IOException {
		
		response.setContentType("text/html");
		
		//read data from the client (form name and age)
		String name=request.getParameter("name");
		String age=request.getParameter("age");
		
		//send back has response has html
		response.getWriter().println("<h3>Welcome, " +name+"! </h3>");
		response.getWriter().println("<h4>your age is "+age+"</h4>");
		
	}
	
}
