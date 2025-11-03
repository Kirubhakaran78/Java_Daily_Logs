package com.example.UploadFileToDB.pojo;


public class FileUpload {

	private int id;
	private String file_name;
	private String file_type;
	private byte[] file_data;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getFile_name() {
		return file_name;
	}
	public void setFile_name(String file_name) {
		this.file_name = file_name;
	}
	public String getFile_type() {
		return file_type;
	}
	public void setFile_type(String file_type) {
		this.file_type = file_type;
	}
	public byte[] getFile_data() {
		return file_data;
	}
	public void setFile_data(byte[] bs) {
		this.file_data = bs;
	}
}
