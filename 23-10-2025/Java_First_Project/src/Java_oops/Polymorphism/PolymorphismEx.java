/*
 * Decompiled with CFR 0.152.
 */
package Java_oops.Polymorphism;

import Java_oops.Polymorphism.Animal;
import Java_oops.Polymorphism.Dog;
import Java_oops.Polymorphism.Pig;

public class PolymorphismEx {
    public static void main(String[] args) {
        Animal objanimal = new Animal();
        Dog objdog = new Dog();
        Pig objpig = new Pig();
        objanimal.animalSound();
        ((Animal)objdog).animalSound();
        ((Animal)objpig).animalSound();
    }
}
