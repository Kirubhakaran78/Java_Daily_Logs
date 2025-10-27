
package multithreading;

// import java.lang.Runnable;
import java.lang.Thread;

class ThreadDemo extends Thread {
   private Thread t;
   private String threadName;

   ThreadDemo(String name) {
      threadName = name;
      System.out.println("Creating " + threadName);
   }

   public void run() {
      System.out.println("Running " + threadName);
      try {
         for (int i = 4; i > 0; i--) {
            System.out.println("Thread: " + threadName + ", " + i);
            // Let the thread sleep for a while.
            Thread.sleep(50);
         }
      } catch (InterruptedException e) {
         System.out.println("Thread " + threadName + " interrupted.");
      }
      System.out.println("Thread " + threadName + " exiting.");
   }

   public void start() {
      System.out.println("Starting " + threadName);
      if (t == null) {
         t = new Thread(this, threadName);
         t.start();
      }
   }
}

public class ThreadTestThread {

   public static void main(String args[]) {
      ThreadDemo T1 = new ThreadDemo("Thread-1");
      T1.start();

      ThreadDemo T2 = new ThreadDemo("Thread-2");
      T2.start();

      // waits for t1 to finish
      T1.join(); // Waits for a thread to finish.
      T2.join();

      T1.setPriority(Thread.MIN_PRIORITY);
      T2.setPriority(Thread.MAX_PRIORITY);


      //Thread Communication
      
      // wait() → thread waits until notified.

      // notify() → wakes up one waiting thread.

      // notifyAll() → wakes up all waiting threads.
   }
}