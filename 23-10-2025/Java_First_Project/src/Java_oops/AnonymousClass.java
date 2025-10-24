/*
 * Decompiled with CFR 0.152.
 */
package Java_oops;

import Java_oops.Normal;
import Java_oops.NormalInterface;

public class AnonymousClass {
    public static void main(String[] args) {
        Normal obj = new Normal(){

            @Override
            public void info() {
                System.out.println("overiding the normal class info method");
            }
        };
        NormalInterface obj2 = new NormalInterface(){

            @Override
            public void info2() {
                System.out.println("info from the anonymous class in interface");
            }
        };
        obj.info();
        obj2.info2();
    }
}
