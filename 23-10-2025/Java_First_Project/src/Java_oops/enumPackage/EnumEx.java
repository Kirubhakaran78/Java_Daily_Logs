/*
 * Decompiled with CFR 0.152.
 */
package Java_oops.enumPackage;

import Java_oops.enumPackage.Level;

public class EnumEx {
    public static void main(String[] args) {
        Level myVar = Level.HIGH;
        System.out.println((Object)myVar);
        Level[] levelArray = Level.values();
        int n = levelArray.length;
        int n2 = 0;
        while (n2 < n) {
            Level variable = levelArray[n2];
            System.out.println((Object)variable);
            ++n2;
        }
        switch (myVar) {
            case LOW: {
                System.out.println("Low level.");
                break;
            }
            case MEDIUM: {
                System.out.println("Medium level.");
                break;
            }
            case HIGH: {
                System.out.println("High level.");
            }
        }
    }
}
