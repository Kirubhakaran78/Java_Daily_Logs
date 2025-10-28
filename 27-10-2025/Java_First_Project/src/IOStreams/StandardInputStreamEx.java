package IOStreams;

import java.io.InputStreamReader;

public class StandardInputStreamEx {

	public static void main(String[] args) {
		
		InputStreamReader cin=null;
		
		try {
			cin= new InputStreamReader(System.in);
			System.out.println("enter the character, type 'q' to quit: "); 
			
			char c;
			do {
				c=(char) cin.read();
				System.out.println(c);
			}while(c != 'q');
			
		}catch(Exception e) {
			e.printStackTrace();
		}finally {
			if(cin != null) {
				try {
					cin.close();
				}catch(Exception e) {
					System.out.println("Error in closing : "+e.getMessage());
				}
				
			}
		}

	}

}
