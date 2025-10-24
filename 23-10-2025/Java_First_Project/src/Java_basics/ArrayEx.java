/*
 * Decompiled with CFR 0.152.
 */
package Java_basics;

public class ArrayEx {
    public static void main(String[] args) {
        String[] strArray = new String[4];
        strArray[0] = "bmw";
        strArray[1] = "mahindra";
        strArray[2] = "suzuki";
        System.out.println(strArray[2]);
        strArray[2] = "suzu";
        System.out.println(strArray.length);
        int i = 0;
        while (i < strArray.length) {
            System.out.println(strArray[i]);
            ++i;
        }
        int[] numbers = new int[]{1, 2, 3, 4, 5};
        int sum = 0;
        int i2 = 0;
        while (i2 < numbers.length) {
            sum += numbers[i2];
            ++i2;
        }
        System.out.println(sum);
        int[][] multiArr = new int[][]{{1, 2, 3, 4}, {5, 6, 7, 8}};
        int row = 0;
        while (row < multiArr.length) {
            int col = 0;
            while (col < multiArr[row].length) {
                System.out.println("multiArr[" + row + "][" + col + "]: " + multiArr[row][col]);
                ++col;
            }
            ++row;
        }
    }
}
