package IOStreams;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class BuffereWriterEx {

	public static void main(String[] args) {
		// BufferedWriter
		String pathout = "C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\IO_Streams_Files\\output.txt";
		
		
		try(BufferedWriter bw = new BufferedWriter(new FileWriter(pathout));) {
			bw.write("Hello from the buffer Writer...");
			bw.newLine();// gives new line
			bw.write("Again from the buffer writer");

			System.out.println("File written successfully.");
		} catch (IOException e) {
			e.printStackTrace();
		}

	}

}
