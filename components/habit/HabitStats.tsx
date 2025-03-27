import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { Habit } from "@/types";
import { calculateHowManyTimesDidAHabitHaveToBeDoneBetweenTwoDates } from "@/utility";
import { styles } from "@/app/habit";
import { calculateStreak } from "@/utility/habit";

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

  console.log(
    "Times to be done: ",
    calculateHowManyTimesDidAHabitHaveToBeDoneBetweenTwoDates(
      habit,
      habit.lastFrequencyUpdate,
      new Date().toUTCString()
    ) + habit.timesDoneBeforeFreqUpdate
  );

  const currentStreak = useMemo(() => {
    return calculateStreak(habit);
  }, [habit]);

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
