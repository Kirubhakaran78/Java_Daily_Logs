/*
 * Decompiled with CFR 0.152.
 */
package Java_oops;

public class OuterClass {
    int x = 9;

    public static void main(String[] args) {
        OuterClass myouterobj = new OuterClass();
        Innerclass myinnerobj = myouterobj.new Innerclass();
        System.out.println(myouterobj.x);
        System.out.println(myinnerobj.y);
        System.out.println(myinnerobj.printX());
    }

    class Innerclass {
        int y = 90;

        Innerclass() {
        }

        public int printX() {
            return OuterClass.this.x;
        }
    }
}
