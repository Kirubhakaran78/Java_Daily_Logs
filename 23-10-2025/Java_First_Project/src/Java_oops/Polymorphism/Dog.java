/*
 * Decompiled with CFR 0.152.
 */
package Java_oops.Polymorphism;

import Java_oops.Polymorphism.Animal;

public class Dog
extends Animal {
    Dog() {
        System.out.println("dog is created...");
    }

    @Override
    public void animalSound() {
        super.animalSound();
        System.out.println("Dod sounds: bark ");
    }
}
