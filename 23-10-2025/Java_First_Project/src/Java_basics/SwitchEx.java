/*
 * Decompiled with CFR 0.152.
 */
package Java_basics;

public class SwitchEx {
    public static void main(String[] args) {
        int day = 2;
        switch (day) {
            case 1: {
                System.out.println("Monday");
                break;
            }
            case 2: {
                System.out.println("Tuesday");
                break;
            }
            default: {
                System.out.println("Default runs when no cases matches");
            }
        }
    }
}
