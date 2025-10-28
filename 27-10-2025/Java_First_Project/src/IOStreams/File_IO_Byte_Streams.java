package IOStreams;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

//copying from the input file to an output file
//FileInputStream and FileOutputStream are frequently used
//Java Byte streams are used to perform input and output of 8-bit bytes
public class File_IO_Byte_Streams {

	public static void main(String[] args) {
		
		FileInputStream in=null;
		FileOutputStream out=null;
		

		try {
			in=new FileInputStream("C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\IO_Streams_Files\\input.txt");
			out=new FileOutputStream("C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\IO_Streams_Files\\output.txt");
			
			int c;
			while((c=in.read())!= -1) {
				out.write(c);
			}
			System.out.println("Copying is completed..");
		}catch(Exception e) {
			System.out.println("Error: "+e.getMessage());
		}
		finally {
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
