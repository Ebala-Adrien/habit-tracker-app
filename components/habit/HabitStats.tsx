import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { Habit } from '@/types';
import { calculateHowManyTimesDidAHabitHaveToBeDoneBetweenTwoDates } from '@/utility';
import styles from '@/components/habitOrTask/styles/habit_or_task_page';

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
    if (toBeDoneCount === 0) return '-';
    return ((habitCount / toBeDoneCount) * 100).toFixed(2);
  }, [habit]);

  return (
    <View style={styles.page_flex_row_block}>
      <View style={styles.statsContainer}>
        <Text style={styles.subtitle_text}>
          {habit.habitCompletions.length}
        </Text>
        <Text style={styles.h3_text}>Total</Text>
      </View>
      <View style={styles.statsContainer}>
        <Text style={styles.subtitle_text}>{habitScore}%</Text>
        <Text style={styles.h3_text}>Score</Text>
      </View>
    </View>
  );
}
