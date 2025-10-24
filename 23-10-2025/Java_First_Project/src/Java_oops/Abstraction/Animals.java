/*
 * Decompiled with CFR 0.152.
 */
package Java_oops.Abstraction;

interface Animals {
    public void eat();

    public static void staticMethodInInterface() {
        System.out.println("static Method In Interface");
    }

    private void privateMethodInInterface() {
        System.out.println("private Method In Interface");
    }

    default public void defaultAnimalMethod() {
        this.privateMethodInInterface();
        System.out.println("Default method in Animals interface");
    }
}
