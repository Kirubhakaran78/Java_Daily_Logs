/*
 * Decompiled with CFR 0.152.
 */
package Java_basics;

public class IfElseEx {
    public static void main(String[] args) {
        int total = 250;
        if (total >= 250 && total <= 350) {
            System.out.println("Grade C ");
        } else if (total > 350 && total <= 420) {
            System.out.println("Grade B");
        } else if (total > 420 && total <= 500) {
            System.out.println("Grade A");
        } else {
            System.out.println("Failed in exam");
        }
    }
}
