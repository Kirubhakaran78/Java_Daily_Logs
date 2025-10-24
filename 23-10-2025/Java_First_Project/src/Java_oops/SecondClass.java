/*
 * Decompiled with CFR 0.152.
 */
package Java_oops;

import Java_oops.FirstClass;

public class SecondClass {
    int x;
    int y;
    String carName;
    String modelName;

    public SecondClass(int xVal) {
        this.x = xVal;
    }

    public SecondClass(String carName) {
        this("bmw_e6", carName);
    }

    public SecondClass(String modelName, String carName) {
        this.modelName = modelName;
        this.carName = carName;
    }

    public SecondClass(int xVal, int yVal) {
        this.x = xVal;
        this.y = yVal;
    }

    public SecondClass() {
    }

    public static void main(String[] args) {
        FirstClass obj1 = new FirstClass();
        obj1.x = 34;
        System.out.println(obj1.x);
        SecondClass obj2 = new SecondClass(21);
        System.out.println("x value from obj2 : " + obj2.x);
        SecondClass obj3 = new SecondClass(23, 24);
        System.out.println("x value from obj3 : " + obj3.x);
        System.out.println("y value from obj3 : " + obj3.y);
        SecondClass obj4 = new SecondClass("bmw");
        System.out.println("Model name from obj4 : " + obj4.modelName);
        System.out.println("Car Name from obj4 : " + obj4.carName);
    }
}
