import { Day, Habit } from "../types";

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

  // Count the occurences of a specific day (e.g. Monday) over a specific period
  export function countOccurrencesOfDay(startDate: number, endDate: number, targetDay: Day) {
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

  export function calculateMonthsBetweenDates(date1: number, date2: number) {
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


  export function calculateHowManyTimesDidAHabitHaveToBeDoneBetweenTwoDates(habit: Habit, startDate: number, endDate: number){
    if (habit?.frequency?.type === "weekly") {
      if (habit.frequency.days) {
        return habit.frequency.days.reduce(
          (acc, curr) =>
            countOccurrencesOfDay(
              startDate,
              endDate,
              curr as Day
            ) + acc,
          0
        );
      } else {
        return 0 // Not implemented yet
      }
    } else {
      if (habit?.frequency?.occurrences) {
        const monthCount =
          calculateMonthsBetweenDates(startDate, endDate)
        const occurencesCount = Math.round(monthCount * habit.frequency.occurrences)
         return occurencesCount;
      } else {
        return 0
      }
    }
  }