import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { Habit } from "@/types";
import { calculateHowManyTimesDidAHabitHaveToBeDoneBetweenTwoDates } from "@/utility";
import { styles } from "@/app/habit";

interface HabitStatsProps {
  habit: Habit;
}

export default function HabitStats({ habit }: HabitStatsProps) {
  const habitScore = useMemo(() => {
    const habitCount = habit.habitCompletions.length;
    const toBeDoneCount =
      calculateHowManyTimesDidAHabitHaveToBeDoneBetweenTwoDates(
        habit,
        habit.lastFrequencyUpdate,
        new Date().toUTCString()
      ) + habit.timesDoneBeforeFreqUpdate;
    if (toBeDoneCount === 0) return "-";
    return ((habitCount / toBeDoneCount) * 100).toFixed(2);
  }, [habit]);

  const currentStreak = useMemo(() => {
    if (!habit.habitCompletions.length) return 0;

    const sortedDates = [...habit.habitCompletions]
      .map((date) => new Date(date))
      .sort((a, b) => b.getTime() - a.getTime()); // Sort descending

    let streak = 1;
    const today = new Date();
    const lastCompletion = sortedDates[0];

    // If the last completion is not today or yesterday, streak is broken
    if (today.getTime() - lastCompletion.getTime() > 2 * 24 * 60 * 60 * 1000) {
      return 0;
    }

    for (let i = 0; i < sortedDates.length - 1; i++) {
      const current = sortedDates[i];
      const next = sortedDates[i + 1];

      // Calculate days difference
      const diffTime = Math.abs(current.getTime() - next.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [habit.habitCompletions]);

  return (
    <View style={styles.statsRow}>
      <View style={styles.statsContainer}>
        <Text style={styles.statsNumber}>{habit.habitCompletions.length}</Text>
        <Text style={styles.statsLabel}>Total</Text>
      </View>
      <View style={styles.statsContainer}>
        <Text style={styles.statsNumber}>{habitScore}%</Text>
        <Text style={styles.statsLabel}>Score</Text>
      </View>
      <View style={styles.statsContainer}>
        <Text style={styles.statsNumber}>{currentStreak}</Text>
        <Text style={styles.statsLabel}>Streak</Text>
      </View>
    </View>
  );
}
