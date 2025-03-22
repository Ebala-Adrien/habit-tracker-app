import { DateType, Day, Habit } from "@/types";
import { shouldHabitBeDoneToday } from "./habitList";

// Calculat the number of times a habit has been done in a row based on the frequency at which it should be done
export const calculateStreak = (habit: Habit): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    // Sort completions by date, most recent first
    const sortedCompletions = [...habit.habitCompletions]
      .map((date) => new Date(date))
      .sort((a, b) => b.getTime() - a.getTime());
  
    if (sortedCompletions.length === 0) return 0;
  
    let streak = 0;
    let currentDate = today;
    let lastCompletionDate = new Date(sortedCompletions[0]);
    lastCompletionDate.setHours(0, 0, 0, 0);
  
    // If the most recent completion is not from today or yesterday, and it should have been done, break streak
    if (
      lastCompletionDate.getTime() < today.getTime() - 24 * 60 * 60 * 1000 &&
      shouldHabitBeDoneToday(
        habit,
        today.getTime(),
        today.getTime(),
        today.getTime(),
        today.getTime(),
        today.getDay() as Day,
        today.getDate() as DateType
      ).shouldBeDone
    ) {
      return 0;
    }
  
    // For each completion date
    for (let i = 0; i < sortedCompletions.length; i++) {
      const completionDate = new Date(sortedCompletions[i]);
      completionDate.setHours(0, 0, 0, 0);
  
      // If this completion is from the current date we're checking
      if (completionDate.getTime() === currentDate.getTime()) {
        streak++;
        // Move to previous day
        currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      }
      // If we missed a day where the habit should have been done, break the streak
      else if (
        (habit.frequency.type === "weekly" &&
          habit.frequency.days?.includes(currentDate.getDay() as Day)) ||
        (habit.frequency.type === "monthly" &&
          habit.frequency.days?.includes(currentDate.getDate() as DateType))
      ) {
        break;
      }
      // If it's a frequency-based habit
      else if (habit.frequency.occurrences) {
        // For weekly habits, check if we've met the weekly quota
        if (habit.frequency.type === "weekly") {
          const weekStart = new Date(currentDate);
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          const weekCompletions = sortedCompletions.filter((date) => {
            const d = new Date(date);
            return d >= weekStart && d <= currentDate;
          }).length;
          if (weekCompletions < habit.frequency.occurrences) break;
        }
        // For monthly habits, check if we've met the monthly quota
        else {
          const monthStart = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
          );
          const monthCompletions = sortedCompletions.filter((date) => {
            const d = new Date(date);
            return d >= monthStart && d <= currentDate;
          }).length;
          if (monthCompletions < habit.frequency.occurrences) break;
        }
      }
  
      // Move to the next completion
      currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    }
  
    return streak;
  };