package streams_API;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

//Streams let you process data in a functional style 
// — i.e., no loops, no temp variables, just pipeline operations.

public class StreamsAPI_Ex {

	public static void main(String[] args) {
		List<Integer> numbers=Arrays.asList(1,2,3,4,5);
		
		List<Integer>  result= numbers.stream() //create a stream 
								.filter(n -> n%2 ==0) //keep only the even
								.map(n-> n*n) //square them
								.collect(Collectors.toList()); //collect back into list
		
		System.out.println(result);
		
		
		//reduce(identity,accumulator)
		// identity ==> initial value
		//accumulator ==> (a,b) -> a+b
		// a - Accumulated result so far
		// b - Current stream element
		// a+b - New accumulated result
		
		int  sum= numbers.stream() //create a stream 
				.filter(n -> n%2 ==0) //keep only the even
				.map(n-> n*n) //square them
				.reduce(0,Integer::sum); //combine elements of a stream into a single result

		System.out.println(sum);
		
	}
}
