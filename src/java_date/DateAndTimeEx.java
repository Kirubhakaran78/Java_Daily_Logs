/*
 * Decompiled with CFR 0.152.
 */
package java_date;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class DateAndTimeEx {
    public static void main(String[] args) {
        LocalDate curDate = LocalDate.now();
        System.out.println(curDate);
        LocalTime curTime = LocalTime.now();
        System.out.println(curTime);
        LocalDateTime curDateTime = LocalDateTime.now();
        System.out.println(curDateTime);
        System.out.println("Before formatting : " + String.valueOf(curDateTime));
        DateTimeFormatter dtFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String strDTFormat = curDateTime.format(dtFormat);
        System.out.println("After Formatting: " + strDTFormat);
    }
}
