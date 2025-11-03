package com.example.UploadFileToDB.repo;

import org.springframework.web.multipart.MultipartFile;

import com.example.UploadFileToDB.pojo.FileUpload;

public interface FileUploadDao {

	void saveFile(MultipartFile file);
	
	FileUpload fetchFileById(int id);
	
}
