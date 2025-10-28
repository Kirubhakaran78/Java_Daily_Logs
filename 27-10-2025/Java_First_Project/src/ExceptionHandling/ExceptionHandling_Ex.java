package ExceptionHandling;

import java.io.FileReader;
import java.io.IOException;

public class ExceptionHandling_Ex {
	
	

	public static void main(String[] args)throws Exception {
		
		try {
			FileReader fr=new FileReader("C:\\Users\\kirubhakaran\\Documents\\Coding_Practice\\Java_Daily_Log-main\\27-10-2025\\File1.txt");
			int c;
			while((c= fr.read()) != -1) {
				System.out.print((char)c);
			}
			fr.close();
			System.out.println();
		}catch(IOException e) {
			System.out.println("Error: "+e.getMessage());
//			e.printStackTrace();
		}
		
		
		
		int a=78;
		int b=0;
		
		try {
			int c=a/b;
			//System.out.println(c);
		}catch(ArithmeticException e) {
			e.printStackTrace();
		}
		
		System.out.println();
		
		
		
		int age=17;
		
		try {
			if(age<18)  {
				throw new Exception("Age should be above 18");
			}else {
				System.out.println("You are eligible");
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		System.out.println();
		
		
		String str[]= {"kirubhakaran","sathish","saran"};
		try{
			
			str=null;
			System.out.println(str[0]);
		}catch(NullPointerException e) {
			System.out.println("Error: "+e.getMessage());
			e.printStackTrace();
		}finally {
			System.out.println("Always printed");
		}
		
	}

}
