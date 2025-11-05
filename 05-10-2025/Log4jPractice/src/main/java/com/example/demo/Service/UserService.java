package com.example.demo.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.pojo.User;
import com.example.demo.repo.UserDao;

@Service
public class UserService {

	public static final Logger log=LoggerFactory.getLogger(UserService.class);
	
	@Autowired
	private UserDao repo;
	
	
	public void save(User user) {
		log.trace("Entering the save() method");
		log.debug("users data before saving {}",user);
		
		
		try {
			log.info("Attempting to save user...");
			repo.save(user);
			
			log.info("User saved successfully.");
		}catch (Exception e) {
			log.error("Error occured while saving user: {} ",e.getMessage(),e);
		}
		
		log.trace("Exiting from the save() method ");	
	}
	
	public List<User> getAllUsers() {
		log.trace("Entering the save() method");
		
		List<User> users=null;
		
		try {
			log.info("Fetching all users from the database ");
			users = repo.findAll();

			if(users.isEmpty()) {
			log.warn("No users found in the database");	
			}
			log.debug("No of user affected {} ",users.size());
		}catch(Exception e) {
			log.error("Error occured while fetching all user: {} ",e.getMessage(),e);
		}
		
		 
		
		log.info("Fetched all the user and shown ");
		log.trace("Exiting from the getAllUsers() method ");
		
		return users;
			
	}
	
	

	
	
	
	
}
