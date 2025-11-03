package com.example.UploadFileToDB.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.UploadFileToDB.pojo.FileUpload;
import com.example.UploadFileToDB.repo.FileUploadDao;

@Service
public class FileUploadService {
	
	@Autowired
	public FileUploadDao dao;

	public void savefile(MultipartFile file) {
		dao.saveFile(file);
	}
	
	public FileUpload getFileById(int id) {
		return dao.fetchFileById(id);
	}

}
