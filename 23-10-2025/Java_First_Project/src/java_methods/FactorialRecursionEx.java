/*
 * Decompiled with CFR 0.152.
 */
package java_methods;

public class FactorialRecursionEx {
    static int factorial(int x) {
        if (x > 1) {
            return x * FactorialRecursionEx.factorial(x - 1);
        }
        return 1;
    }

    public static void main(String[] args) {
        System.out.println(FactorialRecursionEx.factorial(5));
    }
}
