package DateAndTime;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class DateAndTimeEx {

	public static void main(String[] args) {
		LocalDate today=LocalDate.now();
		System.out.println(today);
		
		System.out.println("Plus three days: "+today.plusDays(3));
		System.out.println("Minus two Months: "+today.minusMonths(2));
		System.out.println("Minus two days : "+today.minusDays(7));
		
		
		System.err.println("get year: "+today.getYear());
		System.err.println("get month: "+today.getMonth());
		System.err.println("get day of month: "+today.getDayOfMonth());
		
		
		LocalTime now = LocalTime.now();
        System.out.println("Current time: " + now);

        LocalTime meetingTime = LocalTime.of(10, 30); //hr and minutes
        System.out.println("Meeting time: " + meetingTime);

        // Add or subtract time
        System.out.println("After 2 hours: " + now.plusHours(2));
        System.out.println("Before 15 minutes: " + now.minusMinutes(15));

        // Access fields
        System.out.println("Hour: " + now.getHour());
        System.out.println("Minute: " + now.getMinute());
        
        
        LocalDateTime now2 = LocalDateTime.now();
        System.out.println("Current DateTime: " + now2);

        LocalDateTime custom = LocalDateTime.of(2025, 12, 25, 10, 30); //yyyy,MM,dd,HH,mm
        System.out.println("Custom DateTime: " + custom);

        // Add/subtract
        System.out.println("Tomorrow: " + now2.plusDays(1));
        System.out.println("Last year: " + now2.minusYears(1));
        
        //Date Time Formatter
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        String formatted = now2.format(formatter);
        System.out.println("Formatted DateTime: " + formatted);
        
        //Changing the zone
        ZoneId kolkataZone=ZoneId.of("Asia/Kolkata");
                
        System.out.println("Kolkata time zone "+now2.atZone(kolkataZone));
     
        //to create the utc 
        Instant utcNow=Instant.now();
        System.out.println("UTC : "+utcNow);
        
        
        // UTC → Local (IST)
        Instant utc=Instant.now();
        ZonedDateTime ist=utc.atZone(ZoneId.of("Asia/Kolkata"));
        
        
        
        System.err.println("UTC to ist : "+ist);
                
        //Local to UTC
        
        ZonedDateTime ist2=ZonedDateTime.now(ZoneId.of("Asia/Kolkata"));
        ZonedDateTime utc2=ist2.withZoneSameInstant(ZoneId.of("UTC"));
        
        System.err.println("local to utc : "+utc2);

	}

}
