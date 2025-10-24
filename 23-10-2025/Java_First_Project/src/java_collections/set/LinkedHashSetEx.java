/*
 * Decompiled with CFR 0.152.
 */
package java_collections.set;

import java.util.Iterator;
import java.util.LinkedHashSet;

public class LinkedHashSetEx {
    public static void main(String[] args) {
        LinkedHashSet<String> lhset = new LinkedHashSet<String>();
        lhset.add("hello");
        lhset.add("mango");
        lhset.add("apple");
        lhset.add("banana");
        Iterator st = lhset.iterator();
        System.out.println("Looping through the iterator: ");
        while (st.hasNext()) {
            String element = (String)st.next();
            System.out.println(element);
        }
    }
}
