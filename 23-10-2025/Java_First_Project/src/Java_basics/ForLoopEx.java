/*
 * Decompiled with CFR 0.152.
 */
package Java_basics;

public class ForLoopEx {
    public static void main(String[] args) {
        String[] cars;
        int i = 1;
        while (i < 5) {
            int j = 1;
            while (j < 5) {
                System.out.println(i + " " + j);
                ++j;
            }
            System.out.println();
            ++i;
        }
        String[] stringArray = cars = new String[]{"bmw", "audi", "mahindra"};
        int n = cars.length;
        int n2 = 0;
        while (n2 < n) {
            String car = stringArray[n2];
            System.out.println(car);
            ++n2;
        }
        int number = 2;
        int i2 = 1;
        while (i2 <= 10) {
            System.out.println(number + " x " + i2 + " = " + i2 * number);
            ++i2;
        }
    }
}
