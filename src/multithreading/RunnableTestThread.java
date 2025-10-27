
package multithreading;
import java.lang.Runnable;
import java.lang.Thread;


class RunnableDemo extends Runnable {

    private String threadName;
    private Thread t;

    RunnableDemo(String name) {
        threadName = name;
        System.out.println("Creating..." + threadName);
    }

    void run() {
        System.out.println("Running..." + threadName);

        try {
            for (int i = 4; i > 0; i--) {
                System.out.println("thread: " + threadName + " , " + i);
                Thread.sleep(50);
            }
        } catch (InterruptedException e) {
            System.out.println("thread " + threadName + " interrupted");
        }

        System.out.println(threadName + "exiting.");

    }

    void start(){
        System.out.println("Starting "+threadName);

        if(t==null){
            t= new Thread (this,threadName);
            t.start();
        }
    }

}

public class RunnableTestThread {

    public static void main(String[] args) {
        RunnableDemo r1=new RunnableDemo("thread 1");
        r1.start();

        RunnableDemo r2=new RunnableDemo("thread 2");
        r2.start();
    }
}