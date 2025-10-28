package IOStreams;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

//Copying from the input.txt to output.txt using the BufferedReader and BufferedWriter
public class CopyBufferedReaderToWriter {

	public static void main(String[] args) {
		
		String pathin="C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\IO_Streams_Files\\input.txt";
		String pathout = "C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\IO_Streams_Files\\output.txt";
		try(BufferedReader br=new BufferedReader(new FileReader(pathin));
				BufferedWriter bw=new BufferedWriter(new FileWriter(pathout))){
			
			
			String line;
			while((line=br.readLine()) !=null) {
				bw.write(line);
				bw.newLine();
			}
			
			System.out.println("Copied successfully...!");
			
		}catch(IOException e) {
			e.printStackTrace();
		}
	}

}
