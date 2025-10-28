package fileHandling.WriteMethod;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.List;

public class FileWriteExPractice {

	public static void main(String[] args) {
		// define path
		Path filepath = Paths.get(
				"C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\nioFile2.txt");

		try {
			// 1.create a file if not exists
			String content = "Hello from the Niofile2";
			Files.write(filepath, content.getBytes(StandardCharsets.UTF_8));
			System.out.println("file created successfully");

			// 2.append more text
			String AppendMoreText = "\tI am Kirubha";
			Files.write(filepath, AppendMoreText.getBytes(StandardCharsets.UTF_8), StandardOpenOption.APPEND);
			System.out.println("\n Appended more text \n");

			// 3. Read text
			List<String> lines = Files.readAllLines(filepath);

			for (String s : lines) {
				System.out.println(s);
			}

			// 4.Delete the file
//			try {
//				Files.delete(filepath);
//				System.out.println("Folder is deleted: "+filepath);
//			}catch(IOException e) {
//				e.getStackTrace();
//			}

			// 5.Delete the file if exists
//			boolean deleted=Files.deleteIfExists(filepath);
//			if(deleted) {
//				System.out.println("The file was deleted");
//			}else {
//				System.out.println("The file was not deleted");
//			}

			// 6. delete the entire folder(only if the folder was empty)
			Path dir = Paths.get(
					"C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\Emptyfolder");

			// option 1: using deleteIfExists
//			if(Files.deleteIfExists(dir)) {
//				System.out.println("Folder was deleted..");
//			}else {
//				System.out.println("Folder was not deleted");
//			}

			// Option 2 : using delete
//			try {
//				Files.delete(dir);
//				System.out.println("Folder was deleted");
//			}catch(IOException e) {
//				System.out.println(e.getMessage());
//			}

			// 7.Delete all the files in the folder and the subfolder
			Path dir2 = Paths.get(
					"C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\NioFolder");

			if (Files.exists(dir2)) {
				// Walk through all files/subfolders and delete them
				Files.walk(dir2).sorted((a, b) -> b.compareTo(a))// delete the child and parent
						.forEach(path -> {

							try {
								Files.deleteIfExists(path);
								System.out.println("\n\nFolder deleted : " + path);

							} catch (IOException e) {
								System.out.println("\nfolder not deleted : " + e.getMessage());
							}
						});
				System.out.println("\nall folders are deleted");
			} else {
				System.out.println("\nfolder not found");
			}

		} catch (IOException e) {
			e.printStackTrace();
		}

	}

}
