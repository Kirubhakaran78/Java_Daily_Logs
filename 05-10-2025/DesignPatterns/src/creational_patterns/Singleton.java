package creational_patterns;

public class Singleton {
	//ensures the class has only one instance and provides the global point of access to it
	
	private static Singleton instance;
	
	private Singleton(){}
	
	public static Singleton getInstance() {
		if(instance==null) {
			instance =new Singleton();
		}
		
		return instance;
	}

}
