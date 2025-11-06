package Functional_interface;

import java.util.function.Predicate;

//A Functional Interface is an interface that has exactly one abstract method.
//It is a backbone of Lambda Expression and streams API

public class PredicateEx {
//Takes a value and returns true or false
//used for filtering, and testing the condition
	
	public static void main(String[] args) {
		Predicate<Integer> isEven = num -> num%2==0;
		
		System.out.println(isEven.test(2));
		System.out.println(isEven.test(7));
	}
	
}
