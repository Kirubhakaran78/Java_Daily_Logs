package Java8Features;

// Lambda is an shortcut to create a anonymous class that implement the functional
// interface(an interface with single abstract method)

@FunctionalInterface
interface Greeting{
	void greet();
}


public class LambdaExpressionsEx {

	public static void main(String[] args) {
	
		//Without Lambda expression
		Runnable r=new Runnable() {
			public void run() {
				System.out.println("Running without Lambda!");
			}
		};
		r.run();
		
		//With lamba expression
		Runnable r1=()->{
			System.out.println("running with lamba.!");
		};
		r1.run();
		
		
		Greeting gr=()-> System.out.println("hello from the greeting functional interface");
		
		gr.greet();

	}

}
