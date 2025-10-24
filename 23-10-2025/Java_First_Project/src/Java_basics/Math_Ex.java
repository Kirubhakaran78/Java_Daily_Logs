/*
 * Decompiled with CFR 0.152.
 */
package Java_basics;

public class Math_Ex {
    public static void main(String[] args) {
        int resMax = Math.max(12, 34);
        int resMin = Math.min(22, 67);
        int resSqrt = (int)Math.sqrt(64.0);
        int resAbs = Math.abs(-23);
        int resPow = (int)Math.pow(2.0, 8.0);
        int resRound = (int)Math.round(2.5);
        int resFloor = (int)Math.floor(3.9);
        int resCeil = (int)Math.ceil(2.3);
        double resRandom = Math.random() * 10.0;
        int resRandomBtw1And10 = (int)(Math.random() * 11.0);
        System.out.println(resMax);
        System.out.println(resMin);
        System.out.println(resSqrt);
        System.out.println(resAbs);
        System.out.println(resPow);
        System.out.println("round : " + resRound);
        System.out.println("Ceil : " + resCeil);
        System.out.println("Floor : " + resFloor);
        System.out.println("Random : " + resRandom);
        System.out.println("Random 1 to 10 : " + resRandomBtw1And10);
    }
}
