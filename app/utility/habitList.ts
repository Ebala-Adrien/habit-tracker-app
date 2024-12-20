import { compareDates, countOccurrencesOfDay } from ".";
import { Date, Day, Habit } from "../types";

export const shouldHabitBeDoneToday = (
    habit: Habit,
    startCurrentWeek: number,
    endCurrentWeek: number,
    startCurrentMonth: number,
    endCurrentMonth: number,
    currentDay: Day,
    currentDate: Date,
    ) => {
    const nbOfTimeDoneThisWeek = habit.habitCompletions.filter(
      (o) =>
        startCurrentWeek <= new Date(o).getTime() &&
        endCurrentWeek >= new Date(o).getTime()
    ).length; // How many times did we complete it during the current week

    const nbOfTimeDoneThisMonth = habit.habitCompletions.filter(
      (o) =>
        startCurrentMonth <= new Date(o).getTime() &&
        endCurrentMonth >= new Date(o).getTime()
    ).length; // How many times did we complete it during the current month

    let habitHasToBeDoneToday = true;

    const frequencyType = habit.frequency.type;
    if (frequencyType === "weekly") {
      if (habit.frequency.days) {
        habitHasToBeDoneToday = habit.frequency.days.includes(currentDay);
      } else {
        habitHasToBeDoneToday =
          habit.frequency.occurrences > nbOfTimeDoneThisWeek;
      }
    } else {
      if (habit.frequency.days) {
        habitHasToBeDoneToday = habit.frequency.days.includes(currentDate);
      } else {
        habitHasToBeDoneToday =
          habit.frequency.occurrences > nbOfTimeDoneThisMonth;
      }
    }

    const hasNotBeenDoneToday = !habit.habitCompletions.find((o) =>
      compareDates(new Date(), new Date(o))
    );

    return habitHasToBeDoneToday && hasNotBeenDoneToday;
  }

export const shouldHabitBeDoneThisWeek = (
    habit: Habit,
    startCurrentWeek: number,
    endCurrentWeek: number,
    startCurrentMonth: number,
    endCurrentMonth: number,
    currentDay: Day,
    nbOfDaysInTheCurrentMonth: number
) => {
    const nbOfTimeDoneThisWeek = habit.habitCompletions.filter(
      (o) =>
        startCurrentWeek <= new Date(o).getTime() &&
        endCurrentWeek >= new Date(o).getTime()
    ).length; // How many times did we complete it during the current week

    const nbOfTimeDoneThisMonth = habit.habitCompletions.filter(
      (o) =>
        startCurrentMonth <= new Date(o).getTime() &&
        endCurrentMonth >= new Date(o).getTime()
    ).length; // How many times did we complete it during the current month

    let habitHasToBeDoneThisWeek = true;

    const frequencyType = habit.frequency.type;
    if (frequencyType === "weekly") {
      if (habit.frequency.days) {
        habitHasToBeDoneThisWeek =
          nbOfTimeDoneThisWeek < habit.frequency.days.length &&
          habit.frequency.days.some((d) => d <= currentDay);
      } else {
        habitHasToBeDoneThisWeek =
          habit.frequency.occurrences > nbOfTimeDoneThisWeek;
      }
    } else {
      const hasBeenDoneAllDaysOfTheWeek = nbOfTimeDoneThisWeek >= 6;
      if (habit.frequency.days) {
        const frequencyToBeDoneThisMonth =
          habit.frequency.days.length / nbOfDaysInTheCurrentMonth;
        const frequencyDoneSoFar =
          nbOfTimeDoneThisMonth / new Date(endCurrentWeek).getDate(); // Frequency: Nb of times it has been done so far / date at the end of the current week

        habitHasToBeDoneThisWeek =
          frequencyToBeDoneThisMonth > frequencyDoneSoFar &&
          !hasBeenDoneAllDaysOfTheWeek;
      } else {
        const frequencyToBeDoneThisMonth =
          habit.frequency.occurrences / nbOfDaysInTheCurrentMonth;
        const frequencyDoneSoFar =
          nbOfTimeDoneThisMonth / new Date(endCurrentWeek).getDate(); // Frequency: Nb of times it has been done so far / date at the end of the current week

        habitHasToBeDoneThisWeek =
          frequencyToBeDoneThisMonth > frequencyDoneSoFar &&
          !hasBeenDoneAllDaysOfTheWeek;
      }
    }

    return habitHasToBeDoneThisWeek;
  }


  export const shouldHabitBeDoneThisMonth = (
    habit: Habit,
    startCurrentWeek: number,
    endCurrentWeek: number,
    startCurrentMonth: number,
    endCurrentMonth: number,
    currentDay: Day,
    currentDate: Date,
  ) => {
    const frequencyType = habit.frequency.type;
    let habitHasToBeDoneThisMonth = true;

    const nbOfTimeDoneThisWeek = habit.habitCompletions.filter(
      (o) =>
        startCurrentWeek <= new Date(o).getTime() &&
        endCurrentWeek >= new Date(o).getTime()
    ).length; // How many times did we complete it during the current week

    const nbOfTimeDoneThisMonth = habit.habitCompletions.filter(
      (o) =>
        startCurrentMonth <= new Date(o).getTime() &&
        endCurrentMonth >= new Date(o).getTime()
    ).length; // How many times did we complete it during the current month

    let habitHasToBeDoneThisWeek = true;

    if (frequencyType === "weekly") {
      if (habit.frequency.days) {
        const nbOfTimesItHasToBeDoneThisMonth = habit.frequency.days
          .map((d) =>
            countOccurrencesOfDay(
              startCurrentMonth,
              endCurrentMonth,
              d as Day
            )
          )
          .reduce((acc, curr) => acc + curr, 0);
        const frequencyToBeDoneThisMonth =
          nbOfTimesItHasToBeDoneThisMonth /
          new Date(endCurrentMonth).getDate();
        const frequencyDoneSoFar = nbOfTimeDoneThisMonth / currentDate;

        // If not done enough this month based on month/ratio || If weekly goal not completed
        habitHasToBeDoneThisWeek =
          frequencyDoneSoFar < frequencyToBeDoneThisMonth ||
          (nbOfTimeDoneThisWeek < habit.frequency.days.length &&
            habit.frequency.days.some((d) => d <= currentDay));
      } else {
        const frequencyToBeDoneThisMonth =
          (4.2 * habit.frequency.occurrences) /
          new Date(endCurrentMonth).getDate();
        const frequencyDoneSoFar = nbOfTimeDoneThisMonth / currentDate;

        habitHasToBeDoneThisWeek =
          // If this month frequency is > Than frequency until the end of the month
          frequencyDoneSoFar < frequencyToBeDoneThisMonth ||
          // If this week frequency is > Than frequency so far until the end the week
          habit.frequency.occurrences > nbOfTimeDoneThisWeek;
      }
    } else {
      if (habit.frequency.days) {
        habitHasToBeDoneThisMonth =
          nbOfTimeDoneThisMonth < habit.frequency.days.length &&
          habit.frequency.days.some((d) => d <= currentDate);
      } else {
        habitHasToBeDoneThisMonth =
          habit.frequency.occurrences > nbOfTimeDoneThisMonth; // False if we haven't completed the monthly occurrences
      }
    }

    return habitHasToBeDoneThisMonth;
  };


  export const calculateCompletionCounts = (
    completions: string[],
    startOfWeek: number,
    endOfWeek: number,
    startOfMonth: number,
    endOfMonth: number
  ) => {
    const completionsThisWeek = completions.filter(
      (timestamp) => {
        const time = new Date(timestamp).getTime();
        return time >= startOfWeek && time <= endOfWeek;
      }
    ).length;
  
    const completionsThisMonth = completions.filter(
      (timestamp) => {
        const time = new Date(timestamp).getTime();
        return time >= startOfMonth && time <= endOfMonth;
      }
    ).length;
  
    return { completionsThisWeek, completionsThisMonth };
  };