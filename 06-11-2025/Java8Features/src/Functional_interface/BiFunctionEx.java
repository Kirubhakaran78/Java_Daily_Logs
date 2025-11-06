package Functional_interface;

import java.util.function.BiFunction;
import java.util.function.Function;


// a function which takes two arguments and produces a result.

/*
		@FunctionalInterface
		public interface BiFunction<T, U, R> {
		    R apply(T t, U u);
		}
*/

//T – the type of the first argument
//U – the type of the second argument
//R – the type of the result

public class BiFunctionEx {

	
	public static void main(String[] args) {
		
		BiFunction<Integer,Integer,Integer> add= (a,b) -> a+b;
		
		int result = add.apply(2,3);
		
		System.out.println(result);
		
		//Can be chained using .andThen() to apply another function on the result.
		
		//example with .andThen()
		BiFunction<String,String,String> concat=(a,b)-> a+b;
		
		Function<String,Integer> length=str -> str.length();
		
		int len=concat.andThen(length).apply("hello","Kirubha"); // first concat then length(Function)
		
		System.out.println(len);
		
	}
}
