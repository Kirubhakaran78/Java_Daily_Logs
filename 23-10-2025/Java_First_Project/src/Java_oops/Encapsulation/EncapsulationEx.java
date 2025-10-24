/*
 * Decompiled with CFR 0.152.
 */
package Java_oops.Encapsulation;

import Java_oops.Encapsulation.Person;

public class EncapsulationEx {
    public static void main(String[] args) {
        Person obj = new Person();
        obj.setName("kirubha");
        obj.setPassword("1234");
        System.out.println(obj.getName());
        System.out.println(obj.getPassword());
    }
}
