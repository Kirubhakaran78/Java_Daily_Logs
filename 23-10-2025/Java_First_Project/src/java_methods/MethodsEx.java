/*
 * Decompiled with CFR 0.152.
 */
package java_methods;

public class MethodsEx {
    static void myMethod() {
        System.out.println("My method is called..!");
    }

    static void name(String fname, String lname) {
        System.out.println("my firstname: " + fname + " lastname: " + lname);
    }

    static int doubleGame(int x) {
        return x * 2;
    }

    static int add(int x) {
        return x + x;
    }

    static int add(int x, int y) {
        return x + y;
    }

    public static void main(String[] args) {
        MethodsEx.myMethod();
        MethodsEx.myMethod();
        MethodsEx.name("kirubha", "karan");
        int i = 1;
        while (i <= 5) {
            System.out.println("Double of " + i + "  is : " + MethodsEx.doubleGame(i));
            ++i;
        }
        System.out.println(MethodsEx.add(5));
        System.out.println(MethodsEx.add(4, 5));
    }
}
