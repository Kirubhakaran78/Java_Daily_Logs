package IOStreams;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

public class BufferedReaderEx {

	public static void main(String[] args) throws FileNotFoundException {
		
		//BufferedReader
		
		//using specific character encoding
		//BufferedReader br=new BufferedReader(new InputStreamReader(new FileInputStream("input.txt"),StandardCharsets.UTF_8));
		
		String pathin="C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\IO_Streams_Files\\input.txt";
		try {
			BufferedReader br= new BufferedReader(new FileReader(pathin));
			
			String line;
			while((line=br.readLine())!=null) {
				System.out.println(line);
			}
		}catch(IOException e) {
			e.printStackTrace();
		}
		

		
	}

}
