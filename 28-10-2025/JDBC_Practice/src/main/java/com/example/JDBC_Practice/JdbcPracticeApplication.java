package com.example.JDBC_Practice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.example.JDBC_Practice.repo.JdbcRepository;

@SpringBootApplication
public class JdbcPracticeApplication implements CommandLineRunner{
	//CommandLineRunner -> means it will automatically run the run() method once, before the program exists
	
	
	@Autowired
	private JdbcRepository repo;

	public static void main(String[] args) {
		SpringApplication.run(JdbcPracticeApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception{
		repo.insertAnalyst(2,"sanjay");
		repo.insertAnalyst(3,"aswin");
		repo.insertAnalyst(4,"naveen");
		repo.fetchAnalyst();
		
	}

}
