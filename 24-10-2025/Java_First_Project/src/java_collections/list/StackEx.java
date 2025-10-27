/*
 * Decompiled with CFR 0.152.
 */
package java_collections.list;

import java.util.Iterator;
import java.util.Stack;

public class StackEx {
    public static void main(String[] args) {
        Stack<Integer> stack = new Stack<Integer>();
        stack.push(23);
        stack.push(34);
        stack.push(78);
        stack.push(90);
        System.out.println(stack.pop());
        System.out.println(stack.peek());
        System.out.println(stack.isEmpty());
        System.out.println(stack.size());
        System.out.println(stack.search(23));
        Iterator it = stack.iterator();
        while (it.hasNext()) {
            int num = (Integer)it.next();
            System.out.println(num);
        }
    }
}
