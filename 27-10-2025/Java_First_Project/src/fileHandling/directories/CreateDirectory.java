package fileHandling.directories;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class CreateDirectory {

	public static void main(String[] args) {
		
		// 1. create the directory
		Path dir=Paths.get("C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\myfolder");
		try {
			Files.createDirectory(dir);
			System.out.println("Directory is created ");
		}catch(Exception e) {
			System.out.println("Failed to create the directory : "+ e.getMessage());
		}
		
		
		// 2. Create a directories(recommended)
		//Even if some folders already exist, it won’t throw an error.
		//if already exists it skips creating those folders and create remaining
		Path dir2=Paths.get("C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\parentfolder\\childerfolder");
		try {
			Files.createDirectories(dir2);
			System.out.println("Directories Created..!");
		}catch(Exception e) {
			System.out.println("Failed to create directories : "+e.getMessage());
		}
		
		// 3. Checks if exists
		if(Files.exists(dir2)) {
			System.out.println("The Directory  is exists");
		}else {
			System.out.println("The Directory  is not exists");
		}
		
		// 4. list the directories
		try {
			Files.list(dir2).forEach(path->{
				System.out.println(path.getFileName());// get the files from the folder
			});
		
		} catch (IOException e) {
			
			e.printStackTrace();
		}
		
		// 5. Delete if the directory is empty
//		Path dir3=Paths.get("C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\myfolder");
//		
//		try {
//			Files.deleteIfExists(dir3);
//			System.out.println("Deleted the directory");
//		}catch(Exception e) {
//			System.out.println(e.getMessage());
//		}
		
		// 6. Delete the directory that has the files
		Path dir4 = Paths.get("C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\myfolder2");
		
		if(Files.exists(dir4)) {
			
				try {
					Files.walk(dir4)
					.sorted((a,b)-> b.compareTo(a))
					.forEach(path->{
						try {
							Files.delete(path);
							System.out.println("Deleted: "+path);
						} catch (Exception e) {
							System.out.println("Not deleted "+path+" -> "+e.getMessage()); 
						}
					});
				} catch (IOException e) {
					e.printStackTrace();
				}
				
				System.out.println("All the directory is deleted");
			
		
		}else {
			System.out.println("File was not Found...");
		}
		
		// 7. Check if the directory is file or folder
		//Path dir5=Paths.get("C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\File1.txt");
		Path dir5=Paths.get("C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\Java_First_Project");
		
		if(Files.isDirectory(dir5)) {
			System.out.println("It is a directory");
		}else if(Files.isRegularFile(dir5)) {
			System.out.println("It is a file");
		}
		
		
	}

}
