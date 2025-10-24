/*
 * Decompiled with CFR 0.152.
 */
package Java_basics;

public class Strings_Ex {
    public static void main(String[] args) {
        String firstname = "Kirubha";
        String lastname = "Karan";
        System.out.println(firstname.concat(lastname));
        String txt = "Hello I am from the \\world of \"jurassic park\"";
        System.out.println(txt);
        String newlineEx = "Hello\nWorld";
        System.out.println(newlineEx);
        String backspaceEx = "abc\bd";
        System.out.println(backspaceEx);
        String tabspaceEx = "Hello\tWorld.!";
        System.out.println(tabspaceEx);
    }
}
