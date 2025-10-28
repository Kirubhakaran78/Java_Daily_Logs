package fileHandling.file_outputStream;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

public class FileCreate {

	public static void main(String[] args) {
		
		try {
			byte brWrite[]= {45,56,6,7,8,90};
			
			//Write data(bytes)
			OutputStream os=new FileOutputStream("test.txt");
			
			for(int i=0;i<brWrite.length;i++) {
				os.write(brWrite[i]);
			}
			os.close();
			
			//read data from the file(bytes)
			InputStream in=new FileInputStream("test.txt");
			
			int data;
			while((data=in.read()) != -1) {
				System.out.println((char)data);
			}
			in.close();
			
			
		}catch(Exception e){
			e.printStackTrace();
		}

	}

}
