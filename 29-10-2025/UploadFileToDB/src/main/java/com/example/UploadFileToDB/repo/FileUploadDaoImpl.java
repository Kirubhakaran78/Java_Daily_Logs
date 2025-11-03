package com.example.UploadFileToDB.repo;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import com.example.UploadFileToDB.pojo.FileUpload;

@Repository
public class FileUploadDaoImpl implements FileUploadDao {

	@Autowired
	public DataSource datasource;

	@Override
	public void saveFile(MultipartFile file) {

		String sql = "Insert into uploadTable(file_name,file_type,file_data) values (?,?,?)";

		try (Connection con = datasource.getConnection();
				PreparedStatement ps = con.prepareStatement(sql);
				InputStream inputstream = file.getInputStream()) {// reads the content of the file byte by byte

			ps.setString(1, file.getOriginalFilename());
			ps.setString(2, file.getContentType());

			ps.setBinaryStream(3, inputstream, file.getSize());

			ps.executeUpdate();

		} catch (SQLException e) {
			e.printStackTrace();
		} catch (IOException e1) {
			e1.printStackTrace();
		}

	}

	public FileUpload fetchFileById(int id) {

		FileUpload fileupload = null;

		String sql = "Select id,file_name,file_type,file_data from uploadTable where id=?";

		try (Connection con = datasource.getConnection(); PreparedStatement ps = con.prepareStatement(sql);) {

			ps.setInt(1, id);

			ResultSet rs = ps.executeQuery();

			if (rs.next()) {
				fileupload = new FileUpload();

				fileupload.setId(rs.getInt("id"));
				fileupload.setFile_name(rs.getString("file_name"));
				fileupload.setFile_type(rs.getString("file_type"));

				// reading the file data
				InputStream inputstream = rs.getBinaryStream("file_data");

				// converting the stream to byte array
				ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

				byte[] buffer = new byte[4096]; // 4kb temp array to hold chunks
				int bytesRead;// no of bytes from the buffer

				while ((bytesRead = inputstream.read(buffer)) != -1) {
					outputStream.write(buffer, 0, bytesRead); // starting from 0
				}

				fileupload.setFile_data(outputStream.toByteArray());

				inputstream.close();
				outputStream.close();

			}

		} catch (SQLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		return fileupload;
	}

}
