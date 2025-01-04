import { calculateDaysBetweenDates, calculateMonthsBetweenDates, calculateWeeksBetweenDates, compareDates, countOccurrencesOfDay, getCompletionsInPeriod } from ".";
import { DateType, Day, Habit } from "../types";

export function shouldHabitBeDoneToday(
  habit: Habit,
  startCurrentWeek: number,
  endCurrentWeek: number,
  startCurrentMonth: number,
  endCurrentMonth: number,
  currentDay: Day,
  currentDate: DateType
): boolean {
  const timesCompletedThisWeek = habit.habitCompletions.filter((c) => {
    const t = new Date(c).getTime();
    return t >= startCurrentWeek && t <= endCurrentWeek;
  }).length;

  const timesCompletedThisMonth = habit.habitCompletions.filter((c) => {
    const t = new Date(c).getTime();
    return t >= startCurrentMonth && t <= endCurrentMonth;
  }).length;

  // To check the last time a frequency was updated
  const freqUpdateTime = new Date(habit.lastFrequencyUpdate).getTime();
  const startedBeforeWeek = freqUpdateTime < startCurrentWeek;
  const startedBeforeMonth = freqUpdateTime < startCurrentMonth;

  // Check if the habit was already completed today
  const hasAlreadyBeenDoneToday = habit.habitCompletions.some((c) =>
    compareDates(new Date(), new Date(c))
  );

  const frequency = habit.frequency;
  if (frequency.days) {
    // 'days' -> weekly (0..6) ou monthly (1..31)
    const isScheduledForToday = frequency.type === "weekly"
      ? frequency.days.includes(currentDay)
      : frequency.days.includes(currentDate);

    if (!isScheduledForToday || hasAlreadyBeenDoneToday) return false;
    return true;
  }

  // 'occurrences' -> weekly (0..7) ou monthly (1..30)
  if (frequency.occurrences) {
    if (frequency.type === "weekly") {
      const timesAllowed = startedBeforeWeek
        ? frequency.occurrences
        : calculateWeeksBetweenDates(freqUpdateTime, endCurrentWeek) * frequency.occurrences; // If this habit was started or updated in the middle of the week multiply the occurrences by the amount of weeks between the last update (or creation) and the end of the week. This "amount of weeks" should be between 0 and 1.

      return timesCompletedThisWeek < timesAllowed && !hasAlreadyBeenDoneToday;
    } else {
      // monthly
      const timesAllowed = startedBeforeMonth
        ? frequency.occurrences
        : calculateMonthsBetweenDates(freqUpdateTime, endCurrentMonth) * frequency.occurrences; // If this habit was started or updated in the middle of the month multiply the occurrences by the "amount of months" between the last update (or creation) and the end of the month. This "amount of months" should be between 0 and 1.

      return timesCompletedThisMonth < timesAllowed && !hasAlreadyBeenDoneToday;
    }
  }

  return false;
}


export function shouldHabitBeDoneThisWeek(
  habit: Habit,
  startCurrentWeek: number,
  endCurrentWeek: number,
  startCurrentMonth: number,
  endCurrentMonth: number,
  currentDay: Day,
  nbOfDaysInTheCurrentMonth: number
): boolean {
  const createdAt = new Date(habit.createdAt).getTime();
  const freqUpdate = new Date(habit.lastFrequencyUpdate).getTime();

  // If the habit was created or updated in the middle of the week
  const effectiveWeekStart = Math.max(startCurrentWeek, freqUpdate, createdAt);
  const effectiveMonthStart = Math.max(startCurrentMonth, freqUpdate, createdAt);

  const frequency = habit.frequency;

  // To calculate how many times it was done this week
  const completionsThisWeek = getCompletionsInPeriod(
    habit.habitCompletions,
    effectiveWeekStart,
    endCurrentWeek
  );

  // Function to use for weekly habits
  function checkWeekly(): boolean {
    if (frequency.days) {
      const neededSoFar = frequency.days.filter((d) => d <= currentDay).length; // Based on the week that already happened check how many times we should have done the habit so far this week.
      return completionsThisWeek < neededSoFar;
    } else if (frequency.occurrences) {
      const weeksBetween = calculateWeeksBetweenDates(effectiveWeekStart, endCurrentWeek);
      const totalNeeded = frequency.occurrences * weeksBetween; // Pro rata
      return completionsThisWeek < totalNeeded;
    }
    return false;
  }

  // Function to use for monthly habits
  function checkMonthly(): boolean {
    // 1. Calculate how many times the habit has been done this month
    const completionsThisMonth = getCompletionsInPeriod(
      habit.habitCompletions,
      effectiveMonthStart,
      endCurrentMonth
    );
  
    // 2. Calculate the proportion of the month that has passed by the end of the current week
    const daysInMonth = nbOfDaysInTheCurrentMonth;
    const daysElapsedInMonth = calculateDaysBetweenDates(
      effectiveMonthStart,
      endCurrentWeek
    );
    const monthFractionElapsed = daysElapsedInMonth / daysInMonth;
  
    // 3. Calculate how many times the habit should have been done by the end of this week
    if (frequency.days) {
      // For habits with specific days in the month
      const daysToDoThisMonth = frequency.days.filter((d) => d >= new Date(effectiveMonthStart).getDate());
      const daysToDoSoFar = daysToDoThisMonth.filter((d) => d <= currentDay);
      
      const neededSoFar = daysToDoSoFar.length;
  
      // Compare completions with needed occurrences
      return completionsThisMonth < neededSoFar;
    } else if (frequency.occurrences) {
      // For habits with a set number of occurrences per month
      const totalNeededThisMonth = frequency.occurrences;
      const neededSoFar = Math.ceil(totalNeededThisMonth * monthFractionElapsed);
  
      // Compare completions with needed occurrences
      return completionsThisMonth < neededSoFar;
    }
  
    return false; // Default to false if no valid frequency type
  }
  

  if (frequency.type === "weekly") {
    return checkWeekly();
  } else {
    return checkMonthly();
  }
}


export function shouldHabitBeDoneThisMonth(
  habit: Habit,
  startCurrentWeek: number,
  endCurrentWeek: number,
  startCurrentMonth: number,
  endCurrentMonth: number,
  currentDate: DateType
): boolean {
  const completionsThisMonthPeriod = habit.habitCompletions.filter((c) => {
    const t = new Date(c).getTime();
    return t >= startMonthPeriod && t <= endCurrentMonth;
  }).length;

  const completionsThisWeekPeriod = habit.habitCompletions.filter((c) => {
    const t = new Date(c).getTime();
    return t >= startWeekPeriod && t <= endCurrentWeek;
  }).length;

  const freqUpdate = new Date(habit.lastFrequencyUpdate).getTime();
  const startMonthPeriod = Math.max(startCurrentMonth, freqUpdate)
  const startWeekPeriod = Math.max(startCurrentWeek, freqUpdate)

  const frequency = habit.frequency;
  let hasToBeDone = true;

  if (frequency.type === "weekly") {
    // Weekly habit
    if (frequency.days) {
      // A week period does start at the start of the week if the habit has been created or updated after the start of the week
      // 1. Calculate how many times the habit should be done by the end of the week period
      const timesToBeDoneThisWeek = frequency.days
      .map((d) => countOccurrencesOfDay(startWeekPeriod, endCurrentWeek, d as Day))
      .reduce((a, b) => a + b, 0);
      // 2. Check if the habit has been done enough this week period
      const notDoneEnoughThisWeek = completionsThisWeekPeriod < timesToBeDoneThisWeek;

      // A month period does start at the start of the month if the habit has been created or updated after the start of the month
      // 1. Calculate how many times the habit should be done by the end of the month period 
      const timesToBeDoneThisMonth = frequency.days
        .map((d) => countOccurrencesOfDay(startMonthPeriod, endCurrentMonth, d as Day))
        .reduce((a, b) => a + b, 0);  
      // 2. Check if the habit has been done enough this month period
      const notDoneEnoughThisMonth = completionsThisMonthPeriod < timesToBeDoneThisMonth;

      hasToBeDone = notDoneEnoughThisMonth || notDoneEnoughThisWeek; // If we have not done enough this month or this week we should still do it this month

    } else if (frequency.occurrences) {
      // 1. Calculate the amount of days between the start of the week period and the end of the week
      const daysInTheWeekPeriod = calculateDaysBetweenDates(startWeekPeriod, endCurrentWeek);
      // 2. Calculate how many times should be done by the end of the week based on 1. & the number of occurrences (cross multiplication)
      const timesToBeDoneThisWeekPeriod = (daysInTheWeekPeriod * frequency.occurrences) / 7; // approximative value
      // 3.Check if the habit has been done enough this week
      const notDoneEnoughThisWeek = completionsThisWeekPeriod < timesToBeDoneThisWeekPeriod;

      // 1. Calculate the amount of weeks between the start of the month period and the end of the month
      const weeksInTheMonthPeriod = calculateWeeksBetweenDates(startMonthPeriod, endCurrentMonth);
      // 2. Calculate how many times the habit has to be done this month period based on 1. & the number of occurrences
      const timesToBeDoneThisMonthPeriod = frequency.occurrences * weeksInTheMonthPeriod;
      // 3. Check if the habit has been done enough this month period
      const notDoneEnoughThisMonth = completionsThisMonthPeriod < timesToBeDoneThisMonthPeriod;

      hasToBeDone = notDoneEnoughThisMonth || notDoneEnoughThisWeek; // If we have not done enough this month or this week we should still do it this month
    }
  } else {
    // Monthly habit
    if (frequency.days) {
      const startPeriodDay = new Date(startMonthPeriod).getDate();
      const daysToDo = frequency.days.filter((d) => d >= startPeriodDay);
      hasToBeDone =
        completionsThisMonthPeriod < daysToDo.length &&
        daysToDo.some((d) => d <= currentDate);
    } else if (frequency.occurrences) {
      const monthsBetween = calculateMonthsBetweenDates(startMonthPeriod, endCurrentMonth);
      const totalNeeded = frequency.occurrences * monthsBetween;
      hasToBeDone = totalNeeded > completionsThisMonthPeriod;
    }
  }

  return hasToBeDone;
}
