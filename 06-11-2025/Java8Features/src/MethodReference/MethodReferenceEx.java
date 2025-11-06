package MethodReference;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.function.Function;
import java.util.function.Supplier;

//Method Reference is an "shorthand notation of lambda expressions" to call a method directly. To make the 
// code more readable and cleaner

//Syntax:
// ClassName::methodName

public class MethodReferenceEx {

	public static void main(String[] args) {
		//1.Reference to a Static Method
		Function<Integer,String> intToString= String::valueOf;
		
		System.out.println(intToString.apply(100));
		
		//equals to -> Function<Integer, String> intToString = i -> String.valueOf(i);

		//2. Reference to an Instance Method of a Particular Object
		String message="hello";
		
		Supplier<String> supplier=message::toUpperCase;
		
		System.out.println(supplier.get());
		
		
		//3.Reference to an Instance Method of an Arbitrary Object of a Particular Type
		List<String> lists=Arrays.asList("john,bob,nimal");
		lists.forEach(System.out::println);
		
		//equals to -> lists.forEach(list -> System.out.println(name));

		
		//4. Reference to a Constructor
		Supplier<List<String>> supplierList=ArrayList::new;
		
		//equals to -> Supplier<List<String>> listSupplier = () -> new ArrayList<>();
		
		List<String> list=supplierList.get();
		list.add("kirubha");
		list.add("aswin");
		list.add("ashok");
		
		list.forEach(System.out::println);
		
		
		
	}

}
