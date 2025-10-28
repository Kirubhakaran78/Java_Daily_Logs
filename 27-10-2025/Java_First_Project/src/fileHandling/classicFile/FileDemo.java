package fileHandling.classicFile;

import java.io.*;

public class FileDemo {

	public static void main(String[] args) {
		File f = null;

		String strs[] = {
			"C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\File1.txt",
				"C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\File2.txt",
				"C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\File3.txt" };
		try {
			for (String s : strs) {
			f = new File(s);

				Boolean bool = f.canExecute();

				String a = f.getAbsolutePath();
				System.out.println(a);

				System.out.println("File Executable: " + bool);
				System.out.println(f.exists());
						
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}
