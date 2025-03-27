import constants from "@/constants";
import { daysMapping, monthObject } from "@/data";
import { Day, Habit } from "@/types";
import { compareDates } from "@/utility";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Fragment } from "react";
import { View, Pressable, Text } from "react-native";
import { useHabitContext } from "@/contexts/HabitContext";
type DateSwitcherProps = {
  month: number;
  year: number;
  date: Date;
  setDate: (date: Date) => void;
};

export const DateSwitcher = ({
  month,
  year,
  date,
  setDate,
}: DateSwitcherProps) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: constants.margin,
      }}
    >
      <Pressable
        onPress={() => {
          const newDate = new Date(date);
          newDate.setDate(1);
          newDate.setMonth(newDate.getMonth() - 1);
          setDate(newDate);
        }}
      >
        <Ionicons
          name="chevron-forward-outline"
          size={20}
          color={constants.colorTertiary}
          style={{
            transform: [{ rotate: "180deg" }], // Rotate 45 degrees
          }}
        />
      </Pressable>
      <Text
        style={{
          fontWeight: constants.fontWeight,
          fontSize: constants.mediumFontSize,
        }}
      >
        {monthObject[month]} {year}
      </Text>
      <Pressable
        onPress={() => {
          const newDate = new Date(date);
          newDate.setDate(1);
          newDate.setMonth(newDate.getMonth() + 1);
          setDate(newDate);
        }}
      >
        <Ionicons
          name="chevron-forward-outline"
          size={20}
          color={constants.colorTertiary}
        />
      </Pressable>
    </View>
  );
};

export const CalendarDaysKeysDisplay = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {Object.keys(daysMapping)
        .map((k) => Number(k) as Day)
        .sort((a: Day, b: Day) => {
          return daysMapping[a].order - daysMapping[b].order;
        })
        .map((day) => {
          const key = daysMapping[day].key;

          return (
            <Pressable
              key={day}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: constants.fontWeight,
                  color: constants.colorPrimary,
                }}
              >
                {key}
              </Text>
            </Pressable>
          );
        })}
    </View>
  );
};

type CompletionCalendarProps = {
  year: number;
  month: number;
  days: {
    date: Date;
    weekday: number;
    monthday: number;
    year: number;
    isCurrentMonth: boolean;
  }[];
  habit: Habit;
  habitId: string;
};

export const HabitCompletionCalendar = ({
  days,
  habit,
  year,
  month,
  habitId,
}: CompletionCalendarProps) => {
  const { updateHabitCompletions } = useHabitContext();
  return (
    <View>
      <CalendarDaysKeysDisplay />

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          width: "100%",
          marginTop: constants.padding,
          gap: 0,
        }}
      >
        {days.map((d, i) => {
          const occurred = habit.habitCompletions?.find((o: string) => {
            return compareDates(new Date(o), d.date);
          });
          if (occurred !== undefined) console.log("occurred: ", occurred);
          const dateNotFromCurrentMonth =
            d.date.getMonth() !== new Date(year, month, 10).getMonth();
          const futureDate = d.date.getTime() > new Date().getTime();

          const handlePress = async () => {
            const updatedHabit = occurred
              ? {
                  ...habit,
                  id: habitId,
                  habitCompletions: [...habit.habitCompletions].filter(
                    (o) => !compareDates(new Date(o), d.date)
                  ),
                }
              : {
                  ...habit,
                  id: habitId,
                  habitCompletions: [
                    ...habit.habitCompletions,
                    d.date.toUTCString(),
                  ].sort(
                    (d1, d2) => new Date(d1).valueOf() - new Date(d2).valueOf()
                  ),
                };
            await updateHabitCompletions(updatedHabit);
          };

          return (
            <Fragment key={d.date.toUTCString() + i}>
              <CalendarDate
                onPress={handlePress}
                dateObject={d}
                borderWidth={compareDates(d.date, new Date()) ? 2 : 0}
                backgroundColor={
                  occurred ? constants.colorPrimary : constants.colorSecondary
                }
                color={
                  futureDate || dateNotFromCurrentMonth
                    ? constants.colorQuinary
                    : constants.colorTertiary
                }
                disabled={futureDate}
              />
            </Fragment>
          );
        })}
      </View>
    </View>
  );
};

type HabitStartDateCalendarProps = {
  days: {
    date: Date;
    weekday: number;
    monthday: number;
    year: number;
    isCurrentMonth: boolean;
  }[];
  calendarYear: number;
  calendarMonth: number;
  customStartDate: Date;
  setCustomStartDate: React.Dispatch<React.SetStateAction<Date>>;
  setCalendarDate: React.Dispatch<React.SetStateAction<Date>>;
};

export const HabitStartDateCalendar = ({
  days,
  customStartDate,
  setCustomStartDate,
  setCalendarDate,
  calendarMonth,
  calendarYear,
}: HabitStartDateCalendarProps) => {
  return (
    <>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          padding: constants.padding,
          paddingBottom: constants.padding * 2,
        }}
      >
        <DateSwitcher
          month={calendarMonth}
          year={calendarYear}
          date={customStartDate}
          setDate={setCalendarDate}
        />
      </View>
      <CalendarDaysKeysDisplay />
      <View
        style={{
          flexDirection: "row",
          display: "flex",
          justifyContent: "flex-start",
          flexWrap: "wrap",
          marginTop: constants.padding * 2,
          rowGap: constants.margin * 2,
        }}
      >
        {days.map((d, i) => {
          const dateNotFromCurrentMonth =
            d.date.getMonth() !==
            new Date(calendarYear, calendarMonth, 10).getMonth();

          const handlePress = () => {
            setCustomStartDate(d.date);
          };

          return (
            <Fragment key={d.date.toUTCString() + i}>
              <CalendarDate
                onPress={handlePress}
                dateObject={d}
                borderWidth={0}
                backgroundColor={
                  compareDates(d.date, customStartDate)
                    ? constants.colorQuaternary
                    : constants.colorSecondary
                }
                color={
                  dateNotFromCurrentMonth
                    ? constants.colorPrimary
                    : constants.colorTertiary
                }
                disabled={false}
              />
            </Fragment>
          );
        })}
      </View>
    </>
  );
};

type CalendarDateProps = {
  onPress: () => void;
  backgroundColor: string;
  disabled: boolean;
  borderWidth: number;
  color: string;
  dateObject: {
    date: Date;
    weekday: number;
    monthday: number;
    year: number;
    isCurrentMonth: boolean;
  };
};

const CalendarDate = ({
  dateObject,
  borderWidth,
  backgroundColor,
  color,
  disabled,
  onPress,
}: CalendarDateProps) => {
  return (
    <View
      style={{
        width: "14.28%", // 1/7 of the width
        aspectRatio: 1, // To keep the square
        padding: 2,
      }}
    >
      <Pressable
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          borderWidth,
          borderColor: constants.colorPrimary,
          borderRadius: 50,
          backgroundColor,
        }}
        disabled={disabled}
        onPress={onPress}
      >
        <Text
          style={{
            textAlign: "center",
            color,
          }}
        >
          {dateObject.monthday}
        </Text>
      </Pressable>
    </View>
  );
};
