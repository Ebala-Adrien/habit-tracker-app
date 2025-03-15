import { useHabitContext } from '@/contexts/HabitContext';
import { useTaskContext } from '@/contexts/TaskContext';
import { DateType, Day } from '@/types';
import { getMonthStartAndEnd, getWeekStartAndEnd } from '@/utility';
import {
  shouldHabitBeDoneThisMonth,
  shouldHabitBeDoneThisWeek,
  shouldHabitBeDoneToday,
} from '@/utility/habitList';
import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import NoHabitOrTask from './NoHabitOrTask';
import constants from '@/constants';
import { useRouter } from 'expo-router';
import { useMenuContext } from '@/contexts/MenuContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Habit } from '@/types';

export default function HabitAndTaskList() {
  const { habits } = useHabitContext();
  const { tasks } = useTaskContext();
  const { homeScreenDisplayFrequence: frequence, filter } = useMenuContext();

  const router = useRouter();

  const {
    startCurrentWeek,
    endCurrentWeek,
    startCurrentMonth,
    endCurrentMonth,
    nbOfDaysInCurrentMonth,
    currentDate,
    currentDay,
  } = useMemo(() => {
    const today = new Date();
    const { startOfWeek, endOfWeek } = getWeekStartAndEnd(today);
    const { startOfMonth, endOfMonth } = getMonthStartAndEnd(today);
    const nbOfDaysInCurrentMonth: number = Number(
      new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
    );
    const currentDay = today.getDay() as Day;
    const currentDate = today.getDate() as DateType;

    return {
      startCurrentWeek: startOfWeek,
      endCurrentWeek: endOfWeek,
      startCurrentMonth: startOfMonth,
      endCurrentMonth: endOfMonth,
      nbOfDaysInCurrentMonth: nbOfDaysInCurrentMonth,
      currentDate,
      currentDay,
    };
  }, []);

  const habitList = useMemo(() => {
    if (!filter[0].checked) return [];
    if (frequence === 'Overall') {
      return habits;
    } else if (frequence === 'Day') {
      return habits.filter((h: Habit) =>
        shouldHabitBeDoneToday(
          h,
          startCurrentWeek,
          endCurrentWeek,
          startCurrentMonth,
          endCurrentMonth,
          currentDay,
          currentDate
        )
      );
    } else if (frequence === 'Week') {
      return habits.filter((h: Habit) =>
        shouldHabitBeDoneThisWeek(
          h,
          startCurrentWeek,
          endCurrentWeek,
          startCurrentMonth,
          endCurrentMonth,
          currentDay,
          nbOfDaysInCurrentMonth
        )
      );
    } else {
      return habits.filter((h: Habit) =>
        shouldHabitBeDoneThisMonth(
          h,
          startCurrentWeek,
          endCurrentWeek,
          startCurrentMonth,
          endCurrentMonth,
          currentDate
        )
      );
    }
  }, [habits, frequence, filter]);

  const taskList = useMemo(() => {
    if (!filter[1].checked) return [];
    return tasks;
  }, [tasks, filter]);

  const habitsAndTaskList = [...habitList, ...taskList];

  if (habitsAndTaskList.length < 1)
    return <NoHabitOrTask frequence={frequence} />;

  return (
    <>
      {habitsAndTaskList.map((doc) => {
        const type = 'frequency' in doc ? 'habit' : 'task';

        return (
          <Pressable
            key={doc.id}
            style={{
              backgroundColor: constants.colorSecondary,
              padding: constants.padding * 2,
              marginBottom: constants.padding * 2,
              borderRadius: 10,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: constants.padding * 2,
            }}
            onPress={() => router.push(`/${type}?id=${doc.id}`)}
          >
            {type === 'habit' ? (
              <AntDesign
                name="Trophy"
                size={20}
                color={constants.colorTertiary}
              />
            ) : (
              <AntDesign
                name="checksquareo"
                size={24}
                color={constants.colorTertiary}
              />
            )}
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontWeight: constants.fontWeight,
                  fontSize: constants.mediumFontSize,
                  width: '100%',
                }}
              >
                {doc.title}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </>
  );
}
