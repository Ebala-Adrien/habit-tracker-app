import { DateType, Day, Habit } from "@/types";
import React, { useMemo } from "react";
import NoHabit from "../create/NoHabit";
import { Pressable, Text } from "react-native";
import constants from "@/constants";
import { useRouter } from "expo-router";
import { getMonthStartAndEnd, getWeekStartAndEnd } from "@/utility";
import {
  shouldHabitBeDoneThisMonth,
  shouldHabitBeDoneThisWeek,
  shouldHabitBeDoneToday,
} from "@/utility/habitList";
import { useHabitContext } from "@/contexts/HabitContext";

type Props = {
  frequence: "Day" | "Week" | "Month" | "Overall";
};

export default function HabitList({ frequence }: Props) {
  const router = useRouter();
  const { habits } = useHabitContext();

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

  const list = useMemo(() => {
    if (frequence === "Overall") {
      return habits;
    } else if (frequence === "Day") {
      return habits.filter((h) =>
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
    } else if (frequence === "Week") {
      return habits.filter((h) =>
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
    }

    return habits.filter((h) =>
      shouldHabitBeDoneThisMonth(
        h,
        startCurrentWeek,
        endCurrentWeek,
        startCurrentMonth,
        endCurrentMonth,
        currentDay,
        currentDate
      )
    );
  }, [
    habits,
    frequence,
    startCurrentWeek,
    endCurrentWeek,
    startCurrentMonth,
    endCurrentMonth,
  ]);

  return (
    <>
      {list.length < 1 ? (
        <NoHabit frequence={frequence} />
      ) : (
        <>
          {list.map((habit) => (
            <Pressable
              key={habit.id}
              style={{
                backgroundColor: constants.colorSecondary,
                padding: constants.padding * 2,
                marginBottom: constants.padding * 2,
                borderRadius: 10,
              }}
              onPress={() => router.push(`/habit?id=${habit.id}`)}
            >
              <Text
                style={{
                  fontWeight: constants.fontWeight,
                  fontSize: constants.mediumFontSize,
                }}
              >
                {habit.title}
              </Text>
            </Pressable>
          ))}
        </>
      )}
    </>
  );
}
