package fileHandling.classicFile;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class FileCreate {

	public static void main(String[] args) {
		try {

			// create a file if not existed
			File file = new File(
					"C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\File4.txt");
			if (file.createNewFile()) {
				System.out.println("File is created!");
			} else {
				System.out.println("File is already existed");
			}

			// Write in the file
			FileWriter writer = new FileWriter(file);
			writer.write("Test write");
			writer.close();

			// read the file
			FileReader reader = new FileReader(file);

			int c;

			while ((c = reader.read()) != -1) {
				System.out.print((char) c);
			}
			reader.close();
			
			//Delete the file
			if(file.delete()) {
				System.out.println("\nFile deleted Successfully");
			}else {
				System.out.println("File was not deleted");
			}

		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
