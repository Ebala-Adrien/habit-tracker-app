import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "@/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Habit } from "../types";
import constants from "../constants";
import getCalendarDays, {
  calculateHowManyTimesDidAHabitHaveToBeDoneBetweenTwoDates,
} from "../utility";
import TextBlock from "@/components/habit_or_task/display/TextBlock";
import LoadingComponent from "../components/utility/Loading";
import ErrorComponent from "../components/utility/Error";
import DeleteModal from "../components/habit_or_task/modal/DeleteHabitOrTask";
import {
  HabitCompletionCalendar,
  DateSwitcher,
} from "@/components/utility/Calendar";
import HeaderHabit from "@/components/habit_or_task/HeaderHabitOrTaskPage";
import styles from "@/components/habit_or_task/styles/habit_or_task_page";

export default function HabitPage() {
  const router = useRouter();
  const id = useLocalSearchParams().id as string;

  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [date, setDate] = useState<Date>(new Date());
  const { month, year } = useMemo(() => {
    return {
      month: new Date(date).getMonth(),
      year: new Date(date).getFullYear(),
    };
  }, [date]);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const allDaysInTheMonth = useMemo(() => {
    return getCalendarDays(year, month);
  }, [year, month]);

  const docRef = doc(db, "habit", id.toString());

  useEffect(() => {
    getDoc(docRef)
      .then((doc) => {
        if (doc.exists()) {
          const docData = doc.data() as Habit;
          setHabit(docData);
        } else {
          throw new Error("The doc doesn't exist");
        }
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (habit?.habitCompletions) {
      updateDoc(docRef, {
        updatedAt: new Date(),
        habitCompletions: habit?.habitCompletions,
      })
        .then(() => {})
        .catch(() => {
          console.log("We couldn't update the doc");
        });
    }
  }, [habit?.habitCompletions]);

  const habitScore = useMemo(() => {
    if (!habit) return "-";
    const habitCount = habit?.habitCompletions.length;
    const toBeDoneCount =
      calculateHowManyTimesDidAHabitHaveToBeDoneBetweenTwoDates(
        habit,
        habit.lastFrequencyUpdate,
        new Date().toUTCString()
      ) + habit.timesDoneBeforeFreqUpdate;
    if (toBeDoneCount === 0) return "-";
    return ((habitCount / toBeDoneCount) * 100).toFixed(2);
  }, [habit]);

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
        }}
      >
        {loading ? (
          <LoadingComponent size={80} color={constants.colorSecondary} />
        ) : error || !habit ? (
          <ErrorComponent />
        ) : (
          <>
            <HeaderHabit
              id={id}
              type="habit"
              setShowDeleteModal={setShowDeleteModal}
            />
            <View style={styles.page_content_container}>
              <Text style={styles.page_title}>{habit.title}</Text>

              <View style={styles.page_flex_row_block}>
                <View style={{ display: "flex", alignItems: "center" }}>
                  <Text style={styles.subtitle_text}>
                    {habit.habitCompletions.length}
                  </Text>
                  <Text style={styles.h3_text}>Total</Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.subtitle_text}>{habitScore}%</Text>
                  <Text style={styles.h3_text}>Score</Text>
                </View>
              </View>

              <View
                style={{
                  margin: constants.padding,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    margin: constants.padding,
                  }}
                >
                  <Text style={styles.subtitle_text}>History</Text>
                  <DateSwitcher
                    month={month}
                    year={year}
                    date={date}
                    setDate={setDate}
                  />
                </View>

                <HabitCompletionCalendar
                  days={allDaysInTheMonth}
                  year={year}
                  month={month}
                  habit={habit}
                  setHabit={setHabit}
                />
              </View>

              <TextBlock title="Description" text={habit.description} />
            </View>
          </>
        )}
      </ScrollView>
      {showDeleteModal && (
        <DeleteModal
          id={id}
          setShowModal={setShowDeleteModal}
          habit={habit}
          type="habit"
        />
      )}
    </>
  );
}
