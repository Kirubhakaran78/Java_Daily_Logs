package com.example.UploadFileToDB.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.UploadFileToDB.pojo.FileUpload;
import com.example.UploadFileToDB.service.FileUploadService;

@Controller
public class FileUploadController {
	
	@Autowired
	public FileUploadService service;

	@PostMapping("/uploadFile")
	public ResponseEntity<String> saveFile(@RequestParam("file") MultipartFile file){
		//@RequestParam("file")->key sending by the postman
		
		service.savefile(file);
		
		return ResponseEntity.ok("File upload successfully"+file.getOriginalFilename());
	}
	
	@GetMapping("/fetchFileById")
	public ResponseEntity<byte[]> fetchFileById(@RequestParam int id){
		
		FileUpload file=service.getFileById(id);
		
		return ResponseEntity.ok().body(file.getFile_data());
	}
	
}
