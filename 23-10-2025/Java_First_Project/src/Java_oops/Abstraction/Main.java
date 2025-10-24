/*
 * Decompiled with CFR 0.152.
 */
package Java_oops.Abstraction;

import Java_oops.Abstraction.Animal;
import Java_oops.Abstraction.Dog;

public class Main {
    public static void main(String[] args) {
        Dog obj = new Dog();
        obj.info();
        obj.sound();
        Animal.staticMethodInAnimal();
    }
}
