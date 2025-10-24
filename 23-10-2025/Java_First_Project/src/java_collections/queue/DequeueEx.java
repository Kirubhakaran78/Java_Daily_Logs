/*
 * Decompiled with CFR 0.152.
 */
package java_collections.queue;

import java.util.ArrayDeque;
import java.util.concurrent.ConcurrentLinkedDeque;

public class DequeueEx {
    public static void main(String[] args) {
        ArrayDeque<Integer> dq = new ArrayDeque<Integer>();
        ConcurrentLinkedDeque lkDqSync = new ConcurrentLinkedDeque();
        dq.addFirst(2);
        dq.addFirst(3);
        dq.addFirst(4);
        System.out.println(dq.removeFirst());
        System.out.println(dq.getFirst());
    }
}
