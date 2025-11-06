package Functional_interface;

import java.util.function.Function;

// takes a value and returns another value 
// used for the transforming the data
// **take one type and returns another**
public class FunctionEx {

	public static void main(String[] args) {
		//Takes the string value and return integer value
		
		Function<String,Integer> getLength=str -> str.length();
		
		System.out.println(getLength.apply("chatgpt"));

	}

}
