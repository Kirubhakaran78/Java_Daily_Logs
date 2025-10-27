/*
 * Decompiled with CFR 0.152.
 */
package java_collections.list;

import java.util.ArrayList;
import java.util.Vector;

public class ListEx {
    public static void main(String[] args) {
        ArrayList<Integer> lst = new ArrayList<Integer>();
        lst.add(23);
        lst.add(67);
        lst.add(2, 89);
        lst.set(1, 34);
        System.out.println(lst.get(0));
        lst.remove(0);
        System.out.println(lst.indexOf(34));
        System.out.println(lst.contains(34));
        System.out.println(lst.size());
        Vector name = new Vector();
    }
}
