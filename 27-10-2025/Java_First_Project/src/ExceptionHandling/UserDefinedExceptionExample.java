package ExceptionHandling;


class InvalidException extends Exception{
	InvalidException(String message){
		super(message); // pass message to the Exception class constructor
	}
}

public class UserDefinedExceptionExample {
	
	static void checkAge(int age) throws InvalidException{
		if(age<18) {
			throw new InvalidException("Age must be 18 or above to vote.");
		}else{
			System.out.println("You are eligible to vote!");
		}
	}


	public static void main(String[] args) {
		
		try {
			checkAge(15);
		}catch(InvalidException e) {
			System.out.println(" Error caught: " +e.getMessage());
		}
		
		
	}

}
