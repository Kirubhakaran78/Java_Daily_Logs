/*
 * Decompiled with CFR 0.152.
 */
package java_collections.set;

import java.util.TreeSet;

public class SetEx {
    public static void main(String[] args) {
        TreeSet<String> fruits = new TreeSet<String>();
        fruits.add("mango");
        fruits.add("apple");
        fruits.add("banana");
        System.out.println(fruits.contains("banana"));
        System.out.println(fruits.size());
        System.out.println(fruits.isEmpty());
        System.out.println(fruits.isEmpty());
        System.out.println((String)fruits.first());
        System.out.println(fruits.lower("mango"));
        System.out.println((String)fruits.last());
    }
}
