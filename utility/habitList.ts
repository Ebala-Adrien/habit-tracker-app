import { calculateMonthsBetweenDates, calculateWeeksBetweenDates, compareDates, countOccurrencesOfDay, getCompletionsInPeriod } from ".";
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

    if (!isScheduledForToday || hasAlreadyBeenDoneToday) {
      return false;
    }
    return true;
  }

  // 'occurrences' -> weekly (0..7) ou monthly (1..30)
  if (frequency.occurrences) {
    if (frequency.type === "weekly") {
      const timesAllowed = startedBeforeWeek
        ? frequency.occurrences
        : calculateWeeksBetweenDates(freqUpdateTime, endCurrentWeek) * frequency.occurrences;

      return timesCompletedThisWeek < timesAllowed && !hasAlreadyBeenDoneToday;
    } else {
      // monthly
      const timesAllowed = startedBeforeMonth
        ? frequency.occurrences
        : calculateMonthsBetweenDates(freqUpdateTime, endCurrentMonth) * frequency.occurrences;

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

  function checkWeekly(): boolean {
    if (frequency.days) {
      const neededSoFar = frequency.days.filter((d) => d <= currentDay).length;
      return completionsThisWeek < neededSoFar;
    } else if (frequency.occurrences) {
      const weeksBetween = calculateWeeksBetweenDates(effectiveWeekStart, endCurrentWeek);
      const totalNeeded = frequency.occurrences * weeksBetween;
      return completionsThisWeek < totalNeeded;
    }
    return false;
  }

  function checkMonthly(): boolean {
    let totalNeeded = 0;
    if (frequency.days) {
      totalNeeded = frequency.days.length;
    } else if (frequency.occurrences) {
      totalNeeded = frequency.occurrences;
    }

    const completionsThisMonth = getCompletionsInPeriod(
      habit.habitCompletions,
      effectiveMonthStart,
      endCurrentMonth
    );

    const endPeriod = Math.min(endCurrentMonth, endCurrentWeek);
    const passedDays = endPeriod - effectiveMonthStart + 1;

    const ratioNeededSoFar = (totalNeeded / nbOfDaysInTheCurrentMonth) * passedDays;

    if (completionsThisMonth >= totalNeeded) {
      return false;
    }
    return completionsThisMonth < ratioNeededSoFar;
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
  currentDay: Day,
  currentDate: DateType
): boolean {
  const completionsThisWeek = habit.habitCompletions.filter((c) => {
    const t = new Date(c).getTime();
    return t >= startCurrentWeek && t <= endCurrentWeek;
  }).length;

  const completionsThisMonth = habit.habitCompletions.filter((c) => {
    const t = new Date(c).getTime();
    return t >= startCurrentMonth && t <= endCurrentMonth;
  }).length;

  const freqUpdate = new Date(habit.lastFrequencyUpdate).getTime();
  const updatedBeforeMonth = freqUpdate < startCurrentMonth;
  const startPeriod = updatedBeforeMonth ? startCurrentMonth : freqUpdate;

  const frequency = habit.frequency;
  let hasToBeDone = true;

  if (frequency.type === "weekly") {
    // Weekly habit
    if (frequency.days) {
      const totalDaysInMonth = frequency.days
        .map((d) => countOccurrencesOfDay(startPeriod, endCurrentMonth, d as Day))
        .reduce((a, b) => a + b, 0);

      const ratioNeeded = totalDaysInMonth / new Date(endCurrentMonth).getDate();
      const doneRatio = completionsThisMonth / currentDate;

      const notDoneEnoughMonth = doneRatio < ratioNeeded;
      const notDoneEnoughWeek =
        completionsThisWeek < frequency.days.length &&
        frequency.days.some((d) => d <= currentDay);

      hasToBeDone = notDoneEnoughMonth || notDoneEnoughWeek;
    } else if (frequency.occurrences) {
      const endMonthDay = new Date(endCurrentMonth).getDate();
      const approxNeeded = (4.2 * frequency.occurrences) / endMonthDay;
      const doneRatio = completionsThisMonth / currentDate;
      const notDoneEnoughMonth = doneRatio < approxNeeded;
      const notDoneEnoughWeek = frequency.occurrences > completionsThisWeek;

      hasToBeDone = notDoneEnoughMonth || notDoneEnoughWeek;
    }
  } else {
    // monthly
    if (frequency.days) {
      const startPeriodDay = new Date(startPeriod).getDate();
      const daysToDo = frequency.days.filter((d) => d >= startPeriodDay);
      hasToBeDone =
        completionsThisMonth < daysToDo.length &&
        daysToDo.some((d) => d <= currentDate);
    } else if (frequency.occurrences) {
      const monthsBetween = calculateMonthsBetweenDates(startPeriod, endCurrentMonth);
      const totalNeeded = frequency.occurrences * monthsBetween;
      hasToBeDone = totalNeeded > completionsThisMonth;
    }
  }

  return hasToBeDone;
}
