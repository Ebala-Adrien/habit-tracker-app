import { DateType, Day, Habit } from "@/types";
import { shouldHabitBeDoneToday } from "./habitList";

// Calculate the number of times a habit has been done in a row based on its frequency
export const calculateStreak = (habit: Habit): number => {
    if (habit.habitCompletions.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let currentDate = today;
    let streak = 0;

    if (habit.frequency.type === "weekly") {
        if (habit.frequency.days) {
            // For habits with specific days of the week
            while (true) {
                // If this day is one when the habit should be done
                if (habit.frequency.days.includes(currentDate.getDay() as Day)) {
                    const wasCompletedThisDay = habit.habitCompletions.some(completion => {
                        const completionDate = new Date(completion);
                        completionDate.setHours(0, 0, 0, 0);
                        return completionDate.getTime() === currentDate.getTime();
                    });

                    if (!wasCompletedThisDay) {
                        break; // Break streak if not completed on a required day
                    }
                    streak++;
                }
                currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
            }
        } else if (habit.frequency.occurrences) {
            // For habits with X occurrences per week
            while (true) {
                const weekStart = new Date(currentDate);
                weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                
                // Calculate elapsed days in this week
                const daysElapsed = Math.min(
                    7,
                    Math.floor((currentDate.getTime() - weekStart.getTime()) / (24 * 60 * 60 * 1000)) + 1
                );
                
                // Calculate proportional required occurrences
                const requiredOccurrences = Math.ceil(
                    (habit.frequency.occurrences * daysElapsed) / 7
                );

                // Count completions in this week
                const completionsThisWeek = habit.habitCompletions.filter(completion => {
                    const completionDate = new Date(completion);
                    return completionDate >= weekStart && completionDate <= currentDate;
                }).length;

                if (completionsThisWeek < requiredOccurrences) {
                    break;
                }
                streak++;
                currentDate = new Date(weekStart.getTime() - 24 * 60 * 60 * 1000);
            }
        }
    } else if (habit.frequency.type === "monthly") {
        if (habit.frequency.days) {
            // For habits with specific days of the month
            while (true) {
                if (habit.frequency.days.includes(currentDate.getDate() as DateType)) {
                    const wasCompletedThisDay = habit.habitCompletions.some(completion => {
                        const completionDate = new Date(completion);
                        completionDate.setHours(0, 0, 0, 0);
                        return completionDate.getTime() === currentDate.getTime();
                    });

                    if (!wasCompletedThisDay) {
                        break;
                    }
                    streak++;
                }
                currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
            }
        } else if (habit.frequency.occurrences) {
            // For habits with X occurrences per month
            while (true) {
                const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
                
                // Calculate elapsed days in this month
                const daysElapsed = Math.min(
                    daysInMonth,
                    currentDate.getDate()
                );
                
                // Calculate proportional required occurrences
                const requiredOccurrences = Math.ceil(
                    (habit.frequency.occurrences * daysElapsed) / daysInMonth
                );

                // Count completions in this month
                const completionsThisMonth = habit.habitCompletions.filter(completion => {
                    const completionDate = new Date(completion);
                    return completionDate >= monthStart && completionDate <= currentDate;
                }).length;

                if (completionsThisMonth < requiredOccurrences) {
                    break;
                }
                streak++;
                currentDate = new Date(monthStart.getTime() - 24 * 60 * 60 * 1000);
            }
        }
    }

    return streak;
};