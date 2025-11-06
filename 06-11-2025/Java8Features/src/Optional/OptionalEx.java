package Optional;

import java.util.Optional;

//	Optional<T> is a "container object" that may or may not hold a non-null value.
// It helps to avoid NullPointerException safely.

public class OptionalEx {
	 public static void main(String[] args) {
		Optional<String> name=Optional.of("aswin"); //create a optional with non- null value
		
		Optional<String>  email=Optional.ofNullable(null); //accepts null value also
		
		Optional<String> emptyOpt=Optional.empty(); //Creates empty Optional
		
		 System.out.println(name.get()); //Returns value (throws if empty)
		 
		 System.out.println(email);
		 
		 System.err.println(emptyOpt.orElse("empty")); // Returns value or default
		 
System.out.println("or else get: " +name.orElseGet(() -> "generated delay")); //Lazy version of orElse
		 
		 System.out.println(name.isPresent()); // Checks if value exists (true or false)
		 
		 name.ifPresent(System.out::println); // Executes the code if value exists
		 
		 
		 
		 
		 
	 }
}
