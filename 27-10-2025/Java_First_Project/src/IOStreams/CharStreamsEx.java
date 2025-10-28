package IOStreams;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

//copying from the input file to an output file
//FileReader internally uses FileInputStream and reads two bytes at a time,
// FileWriter internally uses FileOutputStream and reads two bytes at a time,
//FileReader and FileWriter are frequently used
//Java Character streams are used to perform input and output for 16-bit unicode

public class CharStreamsEx {

	public static void main(String[] args) {
		FileReader in=null;
		FileWriter out=null;
		
		try {
			
			in=new FileReader("C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\IO_Streams_Files\\input.txt");
			out=new FileWriter("C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\IO_Streams_Files\\output.txt");
		
		int c;
		while((c=in.read())!=-1) {
			out.write(c);
		}
		
		System.out.println("Copied to output file");
			
		} catch (IOException e) {
			e.printStackTrace();
		}finally {
			
			if(in !=null) {
				try {
					in.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			if(out !=null) {
				try {
					out.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		

	}

}
