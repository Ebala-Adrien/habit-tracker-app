import React, { useState, useMemo } from 'react';
import { View, Text } from 'react-native';
import { Habit } from '@/types';
import {
  HabitCompletionCalendar,
  DateSwitcher,
} from '@/components/utility/Calendar';
import getCalendarDays from '@/utility';
import styles from '@/components/habitOrTask/styles/habit_or_task_page';

interface HabitHistoryProps {
  habit: Habit;
  setHabit: React.Dispatch<React.SetStateAction<Habit | null>>;
}

export default function HabitHistory({ habit, setHabit }: HabitHistoryProps) {
  const [date, setDate] = useState<Date>(new Date());
  const { month, year } = useMemo(
    () => ({
      month: date.getMonth(),
      year: date.getFullYear(),
    }),
    [date]
  );

  const allDaysInTheMonth = useMemo(
    () => getCalendarDays(year, month),
    [year, month]
  );

  return (
    <View style={styles.historyContainer}>
      <View style={styles.historyHeader}>
        <Text style={styles.subtitle_text}>History</Text>
        <DateSwitcher month={month} year={year} date={date} setDate={setDate} />
      </View>

      <HabitCompletionCalendar
        days={allDaysInTheMonth}
        year={year}
        month={month}
        habit={habit}
        setHabit={setHabit}
      />
    </View>
  );
}
