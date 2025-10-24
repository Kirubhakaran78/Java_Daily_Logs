/*
 * Decompiled with CFR 0.152.
 */
package Java_oops.Abstraction;

import Java_oops.Abstraction.Animals;
import Java_oops.Abstraction.Pig;

public class InterfaceMain {
    public static void main(String[] args) {
        Pig obj = new Pig();
        obj.defaultAnimalMethod();
        obj.eat();
        Animals.staticMethodInInterface();
    }
}
