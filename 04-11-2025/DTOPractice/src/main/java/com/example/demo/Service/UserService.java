package com.example.demo.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.pojo.User;
import com.example.demo.pojo.UserDto;
import com.example.demo.repo.UserDao;

@Service
public class UserService {

	private static final Logger log= LoggerFactory.getLogger(UserService.class);
	
	@Autowired
	private UserDao repo;
	
	
	public void save(User user) {
		log.debug("Attempting to save user: {}",user.getName());
		
		repo.save(user);
		
		log.info("User {} saved successfully!"+user.getName());
	}
	
	public List<UserDto> getAllUsers() {
		return repo.findAll()
				.stream()
				.map(this::convertToDto)
				.collect(Collectors.toList());
	}
	
	public UserDto convertToDto(User user){
		UserDto userdto=new UserDto();
		userdto.setName(user.getName());
		userdto.setEmail(user.getEmail());
		
		return userdto;
		
	}

	
	
	
	
}
