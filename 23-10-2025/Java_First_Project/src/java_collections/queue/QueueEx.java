/*
 * Decompiled with CFR 0.152.
 */
package java_collections.queue;

import java.util.Collections;
import java.util.PriorityQueue;

public class QueueEx {
    public static void main(String[] args) {
        PriorityQueue<String> queueObj = new PriorityQueue<String>();
        PriorityQueue pqrev = new PriorityQueue(Collections.reverseOrder());
        queueObj.add("hello");
        queueObj.add("world");
        queueObj.add("apple");
        pqrev.offer("d");
        pqrev.offer("a");
        pqrev.offer("b");
        pqrev.offer("c");
        for (String element : queueObj) {
            System.out.println(element);
        }
        for (String element : pqrev) {
            System.out.println(element);
        }
    }
}
