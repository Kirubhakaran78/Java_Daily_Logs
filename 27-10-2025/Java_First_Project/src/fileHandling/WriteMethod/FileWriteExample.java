package fileHandling.WriteMethod;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.List;
import java.nio.charset.StandardCharsets;

//From the java 7 version
public class FileWriteExample {

	public static void main(String[] args) {
		// define path
		Path filepath = Paths.get(
				"C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\nioFile.txt");

		try {

			// 1. Write text to file (creates file if it doesn't exist)

			// content
			String content = "Hello from the nio file \n I am kirubhakaran\n";
			// StandardCharsets -> the standard way of converting text (characters) into
			// bytes and vice versa.
			Files.write(filepath, content.getBytes(StandardCharsets.UTF_8));
			System.out.println("File created sucessfully");

			// 2.appending more text
			String moreText = "this is an more text to the file";
			Files.write(filepath, moreText.getBytes(StandardCharsets.UTF_8), StandardOpenOption.APPEND);
			System.out.println("Addition Text added");

			// 3.Reading the file
			List<String> lines = Files.readAllLines(filepath, StandardCharsets.UTF_8);

			for (String line : lines) {
				System.out.println(line);
			}
			
			//4.Delete File
			try {
				Files.delete(filepath);
				System.out.println("file deleted successfully");
			}catch(NoSuchFileException e) {
				System.out.println("File not found...");
			}catch(IOException e) {
				System.out.println("Error in deleting file : "+e.getMessage());
			}
						
			//5.Delete if exists - Best practice
			boolean deleted=Files.deleteIfExists(filepath);
			if(deleted) {
				System.out.println("file deleted successfully");
			}else {
				System.out.println("File was not deleted");
			}
			
			//6. Delete the folder if empty
			try {
				//Delete all file from the directory
				//Files.delete() and Files.deleteIfExists() can only delete an empty directory
				Path dir=Paths.get("C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\Emptyfolder");
				Files.deleteIfExists(dir);
				System.out.println("folder deleted.");
			}catch(IOException e) {
				e.printStackTrace();
			}
			
			//7. Delete the folder even if it containes the files
			try {
								
				Path dir2=Paths.get("C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\NioFiles");
				if(Files.exists(dir2)) {
					 // Walk through all files/subfolders and delete them
					Files.walk(dir2)
					.sorted((a,b)-> b.compareTo(a))// Delete children before parent
					.forEach(path->{
						try {
							Files.deleteIfExists(path);
							System.out.println("Deleted: "+path);
						}catch(IOException e) {
							System.out.println("Failed to delete: " + path + " -> " + e.getMessage());
						}
					});
					System.out.println("All folder deleted");
				}else {
					System.out.println("Folder Does not exists");
				}
			}catch(IOException e) {
				e.printStackTrace();
			}
			
			
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

}
