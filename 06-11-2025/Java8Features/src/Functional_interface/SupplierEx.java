package Functional_interface;

import java.util.function.Supplier;

//Takes nothing and return an value
// used for lazy intialization
// **used for supply values - no input, only output**

public class SupplierEx {

	public static void main(String[] args) {
	
		Supplier<Double> getRandomNum=() -> Math.random()*10;

		int randomInt=(int) Math.round(getRandomNum.get());
		
		System.out.println(randomInt);
	}

}
