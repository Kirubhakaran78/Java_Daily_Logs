/*
 * Decompiled with CFR 0.152.
 */
package Java_basics;

public class WhileLoopEx {
    public static void main(String[] args) {
        int i = 9;
        int count = 18;
        while (i > 0) {
            System.out.println("Count : " + i);
            --i;
        }
        do {
            System.out.println("runs atleast once ");
            System.out.println("count from do-while : " + count);
        } while (--count > 10);
    }
}
