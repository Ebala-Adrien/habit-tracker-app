import { Habit } from "@/app/types";
import { useMemo } from "react";
import NoHabit from "../create/NoHabit";
import { Pressable, ScrollView, Text } from "react-native";
import constants from "@/app/constants";
import { useRouter } from "expo-router";
import { compareDates, getWeekStartAndEnd } from "@/app/utility";
import { daysMapping } from "@/app/data";

type Props = {
  habits: Habit[];
  frequence: "Today" | "Weekly" | "Monthly" | "Overall";
};

export default function HabitList({ habits, frequence }: Props) {
  const router = useRouter();

  const list = useMemo(() => {
    if (frequence === "Overall") {
      return habits;
    } else if (frequence === "Today") {
      return habits.filter((h) => {
        if (!h.isRepetitive) return;
        if (!h.frequency) return;
        if (h.frequency.repetition !== "Daily") return;
        const frequency = h.frequency.frequency;
        const currentDayNumber = new Date().getDay() as
          | 0
          | 1
          | 2
          | 3
          | 4
          | 5
          | 6;
        const currentDayName = daysMapping[currentDayNumber];

        return (
          frequency[currentDayName].repeat &&
          !h.occurrences.find((o) => compareDates(new Date(), new Date(o))) // Could not verify this line
        );
      });
    } else if (frequence === "Weekly") {
      return habits.filter((h) => {
        if (!h.isRepetitive) return;
        if (!h.frequency) return;
        if (h.frequency.repetition !== "Weekly") return;
        const frequency = h.frequency.frequency;

        const startCurrentWeek = getWeekStartAndEnd(new Date()).startOfWeek;
        const endCurrentWeek = getWeekStartAndEnd(new Date()).endOfWeek;

        const filteredList = h.occurrences.filter(
          (o) =>
            startCurrentWeek <= new Date(o).getTime() &&
            endCurrentWeek >= new Date(o).getTime()
        );
        if (frequency <= filteredList.length) return;
        return true;
      });
    }
    return habits.filter((h) => {
      if (!h.isRepetitive) return;
      if (!h.frequency) return;
      if (h.frequency.repetition !== "Monthly") return;
      const frequency = h.frequency.frequency;
      const filteredList = h.occurrences.filter(
        (o) =>
          new Date(o).getMonth() === new Date().getMonth() &&
          new Date().getFullYear() === new Date(o).getFullYear()
      );
      if (frequency <= filteredList.length) return;
      return true;
    });
  }, [habits, frequence]);

  return (
    <>
      {list.length < 1 ? (
        <NoHabit frequence={frequence} />
      ) : (
        <ScrollView
          style={{
            paddingHorizontal: constants.padding * 2,
          }}
        >
          {list.map((h) => {
            const { id, title } = h;

            return (
              <Pressable
                key={id}
                style={{
                  backgroundColor: constants.colorSecondary,
                  padding: constants.padding * 2,
                  marginBottom: constants.padding * 2,
                  borderRadius: 10,
                }}
                onPress={() => router.push(`/habit?id=${id}`)}
              >
                <Text
                  style={{
                    fontWeight: constants.fontWeight,
                    fontSize: constants.mediumFontSize,
                  }}
                >
                  {title}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </>
  );
}
