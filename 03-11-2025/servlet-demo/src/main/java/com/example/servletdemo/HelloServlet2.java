package com.example.servletdemo;

//Importing necessary classes
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

//The annotation tells Tomcat what URL will call this servlet
//@WebServlet("/hello2")
public class HelloServlet2 extends HttpServlet {

 // doGet() handles HTTP GET requests (like from a browser)
 @Override
 protected void doGet(HttpServletRequest request, HttpServletResponse response)
         throws ServletException, IOException {

     // Tell the browser we’re sending HTML content
     response.setContentType("text/html");

     // Write the output to the browser
     response.getWriter().println("<h1>Hello from Java Servlet!</h1>");
     response.getWriter().println("<p>This is a simple servlet example.</p>");
 }
}

