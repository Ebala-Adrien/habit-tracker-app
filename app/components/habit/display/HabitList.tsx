import { Date, Day, Habit, HabitFrequency } from "@/app/types";
import { useMemo } from "react";
import NoHabit from "../create/NoHabit";
import { Pressable, ScrollView, Text } from "react-native";
import constants from "@/app/constants";
import { useRouter } from "expo-router";
import {
  compareDates,
  countOccurrencesOfDay,
  getMonthStartAndEnd,
  getWeekStartAndEnd,
} from "@/app/utility";
import {
  calculateCompletionCounts,
  shouldHabitBeDoneThisMonth,
  shouldHabitBeDoneThisWeek,
  shouldHabitBeDoneToday,
} from "@/app/utility/habitList";

type Props = {
  habits: Habit[];
  frequence: "Day" | "Week" | "Month" | "Overall";
};

function HabitLis({ habits, frequence }: Props) {
  const router = useRouter();

  const list = useMemo(() => {
    const currentDay = new Date().getDay() as Day;
    const currentDate = new Date().getDate() as Date;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const startCurrentWeek = getWeekStartAndEnd(new Date()).startOfWeek;
    const endCurrentWeek = getWeekStartAndEnd(new Date()).endOfWeek;

    const startCurrentMonth = getMonthStartAndEnd(new Date()).startOfMonth;
    const endCurrentMonth = getMonthStartAndEnd(new Date()).endOfMonth;

    const nbOfDaysInTheCurrentMonth = new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();

    if (frequence === "Overall") {
      return habits;
    } else if (frequence === "Day") {
      return habits.filter((h) => {
        const nbOfTimeDoneThisWeek = h.habitCompletions.filter(
          (o) =>
            startCurrentWeek <= new Date(o).getTime() &&
            endCurrentWeek >= new Date(o).getTime()
        ).length; // How many times did we complete it during the current week

        const nbOfTimeDoneThisMonth = h.habitCompletions.filter(
          (o) =>
            startCurrentMonth <= new Date(o).getTime() &&
            endCurrentMonth >= new Date(o).getTime()
        ).length; // How many times did we complete it during the current month

        let habitHasToBeDoneToday = true;

        const frequencyType = h.frequency.type;
        if (frequencyType === "weekly") {
          if (h.frequency.days) {
            habitHasToBeDoneToday = h.frequency.days.includes(currentDay);
          } else {
            habitHasToBeDoneToday =
              h.frequency.occurrences > nbOfTimeDoneThisWeek;
          }
        } else {
          if (h.frequency.days) {
            habitHasToBeDoneToday = h.frequency.days.includes(currentDate);
          } else {
            habitHasToBeDoneToday =
              h.frequency.occurrences > nbOfTimeDoneThisMonth;
          }
        }

        const hasNotBeenDoneToday = !h.habitCompletions.find((o) =>
          compareDates(new Date(), new Date(o))
        );

        return habitHasToBeDoneToday && hasNotBeenDoneToday;
      });
    } else if (frequence === "Week")
      return habits.filter((h) => {
        const nbOfTimeDoneThisWeek = h.habitCompletions.filter(
          (o) =>
            startCurrentWeek <= new Date(o).getTime() &&
            endCurrentWeek >= new Date(o).getTime()
        ).length; // How many times did we complete it during the current week

        const nbOfTimeDoneThisMonth = h.habitCompletions.filter(
          (o) =>
            startCurrentMonth <= new Date(o).getTime() &&
            endCurrentMonth >= new Date(o).getTime()
        ).length; // How many times did we complete it during the current month

        let habitHasToBeDoneThisWeek = true;

        const frequencyType = h.frequency.type;
        if (frequencyType === "weekly") {
          if (h.frequency.days) {
            habitHasToBeDoneThisWeek =
              nbOfTimeDoneThisWeek < h.frequency.days.length &&
              h.frequency.days.some((d) => d <= currentDay);
          } else {
            habitHasToBeDoneThisWeek =
              h.frequency.occurrences > nbOfTimeDoneThisWeek;
          }
        } else {
          const hasBeenDoneAllDaysOfTheWeek = nbOfTimeDoneThisWeek >= 6;
          if (h.frequency.days) {
            const frequencyToBeDoneThisMonth =
              h.frequency.days.length / nbOfDaysInTheCurrentMonth;
            const frequencyDoneSoFar =
              nbOfTimeDoneThisMonth / new Date(endCurrentWeek).getDate(); // Frequency: Nb of times it has been done so far / date at the end of the current week

            habitHasToBeDoneThisWeek =
              frequencyToBeDoneThisMonth > frequencyDoneSoFar &&
              !hasBeenDoneAllDaysOfTheWeek;
          } else {
            const frequencyToBeDoneThisMonth =
              h.frequency.occurrences / nbOfDaysInTheCurrentMonth;
            const frequencyDoneSoFar =
              nbOfTimeDoneThisMonth / new Date(endCurrentWeek).getDate(); // Frequency: Nb of times it has been done so far / date at the end of the current week

            habitHasToBeDoneThisWeek =
              frequencyToBeDoneThisMonth > frequencyDoneSoFar &&
              !hasBeenDoneAllDaysOfTheWeek;
          }
        }

        return habitHasToBeDoneThisWeek;
      });
    // If Month view
    return habits.filter((h) => {
      const frequencyType = h.frequency.type;
      let habitHasToBeDoneThisMonth = true;

      const nbOfTimeDoneThisWeek = h.habitCompletions.filter(
        (o) =>
          startCurrentWeek <= new Date(o).getTime() &&
          endCurrentWeek >= new Date(o).getTime()
      ).length; // How many times did we complete it during the current week

      const nbOfTimeDoneThisMonth = h.habitCompletions.filter(
        (o) =>
          startCurrentMonth <= new Date(o).getTime() &&
          endCurrentMonth >= new Date(o).getTime()
      ).length; // How many times did we complete it during the current month

      let habitHasToBeDoneThisWeek = true;

      if (frequencyType === "weekly") {
        if (h.frequency.days) {
          const nbOfTimesItHasToBeDoneThisMonth = h.frequency.days
            .map((d) =>
              countOccurrencesOfDay(
                startCurrentMonth,
                endCurrentMonth,
                d as Day
              )
            )
            .reduce((acc, curr) => acc + curr, 0);
          const frequencyToBeDoneThisMonth =
            nbOfTimesItHasToBeDoneThisMonth /
            new Date(endCurrentMonth).getDate();
          const frequencyDoneSoFar = nbOfTimeDoneThisMonth / currentDate;

          // If not done enough this month based on month/ratio || If weekly goal not completed
          habitHasToBeDoneThisWeek =
            frequencyDoneSoFar < frequencyToBeDoneThisMonth ||
            (nbOfTimeDoneThisWeek < h.frequency.days.length &&
              h.frequency.days.some((d) => d <= currentDay));
        } else {
          const frequencyToBeDoneThisMonth =
            (4.2 * h.frequency.occurrences) /
            new Date(endCurrentMonth).getDate();
          const frequencyDoneSoFar = nbOfTimeDoneThisMonth / currentDate;

          habitHasToBeDoneThisWeek =
            // If this month frequency is > Than frequency until the end of the month
            frequencyDoneSoFar < frequencyToBeDoneThisMonth ||
            // If this week frequency is > Than frequency so far until the end the week
            h.frequency.occurrences > nbOfTimeDoneThisWeek;
        }
      } else {
        if (h.frequency.days) {
          habitHasToBeDoneThisMonth =
            nbOfTimeDoneThisMonth < h.frequency.days.length &&
            h.frequency.days.some((d) => d <= currentDate);
        } else {
          habitHasToBeDoneThisMonth =
            h.frequency.occurrences > nbOfTimeDoneThisMonth; // False if we haven't completed the monthly occurrences
        }
      }

      return habitHasToBeDoneThisMonth;
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

export default function HabitList({ habits, frequence }: Props) {
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
    const nbOfDays: number = Number(
      new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
    );
    const currentDay = new Date().getDay() as Day;
    const currentDate = new Date().getDate() as Date;

    return {
      startCurrentWeek: startOfWeek,
      endCurrentWeek: endOfWeek,
      startCurrentMonth: startOfMonth,
      endCurrentMonth: endOfMonth,
      nbOfDaysInCurrentMonth: nbOfDays,
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
        <ScrollView
          style={{
            paddingHorizontal: constants.padding * 2,
          }}
        >
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
        </ScrollView>
      )}
    </>
  );
}
