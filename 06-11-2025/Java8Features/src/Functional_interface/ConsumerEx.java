package Functional_interface;

import java.util.function.Consumer;

// Takes a value  | Does something (no return) | Used for printing or logging 
//  **used for performing an action - no return value**
public class ConsumerEx {

	public static void main(String[] args) {
		
		Consumer<String> printName= name -> System.out.println("Hello "+name);
				

		printName.accept("kirubhakaran");
	}

}
