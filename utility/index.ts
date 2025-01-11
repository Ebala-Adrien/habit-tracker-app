import { Day, Habit } from "../types";

// Check if two dates belong to the exact same day
export function compareDates(date1: Date, date2: Date){
    return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
}

export function getWeekStartAndEnd(date: Date) {
    // Ensure input is a Date object
    const givenDate = new Date(date);
  
    // Find the day of the week (0 = Sunday, 1 = Monday, etc.)
    let dayOfWeek = givenDate.getDay();
    if (dayOfWeek === 0) {
      dayOfWeek = 7; // Treat Sunday as the 7th day for Monday-based week
    }
  
    // Calculate the start of the week (Monday)
    const startOfWeek = new Date(givenDate);
    startOfWeek.setDate(givenDate.getDate() - (dayOfWeek - 1));
    startOfWeek.setHours(0, 0, 0, 0); // Set to 00:00:00
  
    // Calculate the end of the week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Add 6 days to get Sunday
    endOfWeek.setHours(23, 59, 59, 999); // Set to 23:59:59
    
    // Return the start and end of the week
    return {
        startOfWeek: startOfWeek.getTime(),
        endOfWeek: endOfWeek.getTime(),
    };
  }

  export function getMonthStartAndEnd(date: Date) {
    // Ensure input is a Date object
    const givenDate = new Date(date);
  
    // Calculate the start of the month
    const startOfMonth = new Date(
      givenDate.getFullYear(),
      givenDate.getMonth(),
      1
    );
    startOfMonth.setHours(0, 0, 0, 0); // Set to 00:00:00
  
    // Calculate the end of the month
    const endOfMonth = new Date(
      givenDate.getFullYear(),
      givenDate.getMonth() + 1,
      0
    ); // 0th day of the next month gives the last day of the current month
    endOfMonth.setHours(23, 59, 59, 999); // Set to 23:59:59
  
    // Return the start and end of the month
    return {
      startOfMonth: startOfMonth.getTime(),
      endOfMonth: endOfMonth.getTime(),
    };
  }

  // Count the occurrences of a specific day (e.g. Monday) over a specific period
  export function countOccurrencesOfDay(startDate: number | string, endDate: number | string, targetDay: Day) {
  // Convert dates to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);


  // Find the first occurrence of the target day
  let firstOccurrence = new Date(start);
  while (firstOccurrence.getDay() !== targetDay) {
      firstOccurrence.setDate(firstOccurrence.getDate() + 1);
  }

  // If the first occurrence is after the end date, return 0
  if (firstOccurrence > end) {
      return 0;
  }

   // Calculate the total number of days between the first occurrence and the end date
   const daysBetween = (end.getTime() - firstOccurrence.getTime()) / (1000 * 60 * 60 * 24);

   // Count the number of weeks and add 1 for the first occurrence
   return Math.floor(daysBetween / 7) + 1;


  }

  // Count the occurrences of a specific date (e.g., the 15th) over a specific period
  export function countOccurrencesOfDate(startDate: number | string, endDate: number | string, targetDate: number) {
    // Convert dates to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Ensure targetDate is a valid day of the month
    if (targetDate < 1 || targetDate > 31) {
      throw new Error("Invalid target date. Must be between 1 and 31.");
    }
  
    // Find the first occurrence of the target date
    let firstOccurrence = new Date(start);
    if (firstOccurrence.getDate() > targetDate) {
      // Move to the next month if the target date has passed in the starting month
      firstOccurrence.setMonth(firstOccurrence.getMonth() + 1);
      firstOccurrence.setDate(targetDate);
    } else {
      // Set the date to the target date in the current month
      firstOccurrence.setDate(targetDate);
    }
  
    // If the first occurrence is after the end date, return 0
    if (firstOccurrence > end) {
      return 0;
    }
  
    // Count occurrences by iterating through months
    let count = 0;
    let currentOccurrence = new Date(firstOccurrence);
  
    while (currentOccurrence <= end) {
      count++;
      currentOccurrence.setMonth(currentOccurrence.getMonth() + 1);
    }
  
    return count;
  }

  export function calculateMonthsBetweenDates(date1: number | string, date2: number | string) {
    // Parse the input dates
    const d1 = new Date(date1);
    const d2 = new Date(date2);
  
    // Calculate the year and month difference
    const yearsDifference = d2.getFullYear() - d1.getFullYear();
    const monthsDifference = d2.getMonth() - d1.getMonth();
  
    // Total months difference
    let totalMonths = yearsDifference * 12 + monthsDifference;
  
    // Calculate the fractional part of the month
    const daysInStartMonth = new Date(d1.getFullYear(), d1.getMonth() + 1, 0).getDate();
    const dayFraction = (d2.getDate() - d1.getDate()) / daysInStartMonth;
  
    // Add the fractional part to the total months
    totalMonths += dayFraction;
  
    return Math.abs(totalMonths); // Ensure the result is positive
  }

  export function calculateWeeksBetweenDates(date1: number | string, date2: number | string) {
    // Parse the input dates
    const d1 = new Date(date1);
    const d2 = new Date(date2);
  
    // Get time difference in milliseconds
    const diffInMs = d2.getTime() - d1.getTime();
  
    // Convert milliseconds to days
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  
    // Convert days to weeks
    const diffInWeeks = diffInDays / 7;
  
    // Return the absolute value in case date2 is earlier than date1
    return Math.abs(diffInWeeks);
  }

  export function calculateDaysBetweenDates(date1: number | string, date2: number | string) {
    // Parse the input dates
    const d1 = new Date(date1);
    const d2 = new Date(date2);
  
    // Calculate the time difference in milliseconds
    const timeDifference = Math.abs(d2.getTime() - d1.getTime());
  
    // Convert the time difference to days
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  
    return daysDifference;
  }

  export function calculateHowManyTimesDidAHabitHaveToBeDoneBetweenTwoDates(habit: Habit, startDate: number | string, endDate: number | string){ 
   
    if(new Date(startDate).getTime() > new Date(endDate).getTime()) {
      return 0 } 
    if (habit?.frequency?.type === "weekly") {
      if (habit.frequency.days) {
        return habit.frequency.days.reduce(
          (acc, curr) =>
            countOccurrencesOfDay(
              startDate,
              endDate,
              curr as Day
            ) 
            + 
            acc,
          0
        );
      } else {
        return 0 // Not implemented yet
      }
    } else {
      if (habit?.frequency?.occurrences) {
        const monthCount =
          calculateMonthsBetweenDates(startDate, endDate)
        const occurrencesCount = Math.round(monthCount * habit.frequency.occurrences)
         return occurrencesCount;
      } else {
        return 0 // Not yet implemented
      }
    }
  }

  export function getCompletionsInPeriod(
    completions: string[],
    windowStart: number,
    windowEnd: number
  ): number {
    return completions.filter((c) => {
      const time = new Date(c).getTime();
      return time >= windowStart && time <= windowEnd;
    }).length;
  }


  export default function getCalendarDays(year: number, month: number) {
    const TOTAL_DAYS = 42; // 6 weeks * 7 days

    // Helper to create a new date without mutation
    const createDate = (y: number, m: number, d: number) => new Date(y, m, d);

    // Get the first day of the given month
    const firstDayOfMonth = createDate(year, month, 1);

    // Determine the weekday of the first day of the month (0 = Sunday, 1 = Monday, ...)
    const firstWeekday = (firstDayOfMonth.getDay() + 6) % 7; // Adjust to start on Monday

    // Calculate the start date for the calendar (Monday of the first week)
    const calendarStartDate = new Date(
      firstDayOfMonth.getTime() - firstWeekday * 24 * 60 * 60 * 1000
    );

    // Generate the array of 42 days
    const calendarDays = Array.from({ length: TOTAL_DAYS }, (_, index) => {
      const currentDate = new Date(
        calendarStartDate.getTime() + index * 24 * 60 * 60 * 1000
      );
      return {
        date: currentDate,
        weekday: currentDate.getDay(),
        monthday: currentDate.getDate(),
        year: currentDate.getFullYear(),
        isCurrentMonth: currentDate.getMonth() === month,
      };
    });

    return calendarDays;
}