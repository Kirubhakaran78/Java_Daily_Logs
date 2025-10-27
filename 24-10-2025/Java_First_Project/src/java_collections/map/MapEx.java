/*
 * Decompiled with CFR 0.152.
 */
package java_collections.map;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;

public class MapEx {
    public static void main(String[] args) {
        HashMap<String, Integer> hm = new HashMap<String, Integer>();
        LinkedHashMap lm = new LinkedHashMap();
        TreeMap<Integer, String> tm = new TreeMap<Integer, String>();
        hm.put("kirubha", 1);
        hm.put("ram", 2);
        hm.put("aswin", 3);
        tm.put(5, "Apple");
        tm.put(2, "Banana");
        tm.put(8, "Cherry");
        tm.put(1, "Mango");
        System.out.println(hm.get("kirubha"));
        hm.remove("ram");
        System.out.println(hm.containsKey("ram"));
        System.out.println(hm.keySet());
        System.out.println(hm.values());
        System.out.println(hm.entrySet());
        System.out.println(hm.isEmpty());
        System.out.println(hm.size());
        hm.clear();
        System.out.println(hm.isEmpty());
        System.out.println(tm.firstKey());
        System.out.println(tm.higherKey(2));
        System.out.println(tm.lowerKey(2));
        Iterator it = hm.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry entry = it.next();
            if (((String)entry.getKey()).equals("2")) {
                it.remove();
            }
            System.out.println((String)entry.getKey() + " => " + String.valueOf(entry.getValue()));
        }
        for (Map.Entry entry : hm.entrySet()) {
            System.out.println((String)entry.getKey() + " => " + String.valueOf(entry.getValue()));
        }
    }
}
