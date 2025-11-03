package com.example.RetrieveDataFromJson;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

//import com.example.RetrieveDataFromJson.repo.StudentRepository;

@SpringBootApplication
public class RetrieveDataFromJsonApplication {//implements CommandLineRunner
	
//	@Autowired
//	public StudentRepository repo;

	public static void main(String[] args) {
		SpringApplication.run(RetrieveDataFromJsonApplication.class, args);
	}
	
//	@Override
//	public void run(String... args) throws Exception{
//		repo.insertStudent(1,"kirubhakaran");
//		repo.fetchStudent();
//	}

}
