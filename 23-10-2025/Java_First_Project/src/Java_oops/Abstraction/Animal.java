/*
 * Decompiled with CFR 0.152.
 */
package Java_oops.Abstraction;

abstract class Animal {
    Animal() {
    }

    abstract void sound();

    public void info() {
        System.out.println("Default method in Animal, Optional to override");
    }

    static void staticMethodInAnimal() {
        System.out.println("Can't override,it belong to animal class");
    }
}
