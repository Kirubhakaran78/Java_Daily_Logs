/*
 * Decompiled with CFR 0.152.
 */
package Java_oops.Abstraction;

import Java_oops.Abstraction.Animals;

class Pig
implements Animals {
    Pig() {
    }

    @Override
    public void eat() {
        System.out.println("Yes pig can eat food");
    }
}
