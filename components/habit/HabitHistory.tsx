import React, { useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import {
  HabitCompletionCalendar,
  DateSwitcher,
} from '@/components/utility/Calendar';
import getCalendarDays from '@/utility';
import styles from '@/components/habitOrTask/styles/habit_or_task_page';
import { useHabitContext } from '@/contexts/HabitContext';

export default function HabitHistory() {
  const [date, setDate] = useState<Date>(new Date());
  const { currentHabit, setCurrentHabit } = useHabitContext();

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

  if (!currentHabit) return null;

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
        habit={currentHabit}
        setHabit={setCurrentHabit}
      />
    </View>
  );
}
