import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { db } from "@/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Day, Habit } from "../types";
import constants from "../constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import getCalendarDays, {
  calculateHowManyTimesDidAHabitHaveToBeDoneBetweenTwoDates,
  compareDates,
} from "../utility";
import Description from "../components/habit/display/Description";
import LoadingComponent from "../components/utility/Loading";
import ErrorComponent from "../components/utility/Error";
import { useRouter } from "expo-router";
import DeleteModal from "../components/habit/modal/DeleteHabit";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { daysMapping, monthObject } from "@/data";
import {
  HabitCompletionCalendar,
  DateSwitcher,
} from "@/components/utility/Calendar";

export default function HabitPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

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
            <View
              style={{
                backgroundColor: constants.colorSecondary,
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
                paddingVertical: constants.padding,
              }}
            >
              {/* Back Button */}
              <Pressable
                style={{ padding: constants.padding }}
                onPress={() => router.push("/(tabs)")}
              >
                <Ionicons
                  name="arrow-back"
                  size={28}
                  color={constants.colorTertiary}
                />
              </Pressable>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: constants.padding,
                  gap: constants.padding,
                }}
              >
                <Pressable onPress={() => setShowDeleteModal(true)}>
                  <FontAwesome6 name="trash-can" size={28} color="black" />
                </Pressable>
                <Pressable
                  onPress={() => router.push(`/update-habit?id=${id}`)}
                >
                  <FontAwesome6 name="edit" size={28} color="black" />
                </Pressable>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                paddingBottom: constants.padding * 2,
              }}
            >
              <Text
                style={{
                  margin: constants.padding,
                  fontWeight: constants.fontWeight,
                  fontSize: constants.largeFontSize,
                }}
              >
                {habit.title}
              </Text>
              <View
                style={{
                  margin: constants.padding,
                  padding: constants.padding,
                  gap: constants.padding * 4,
                  backgroundColor: constants.colorSecondary,
                  borderRadius: 10,
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: constants.fontWeight,
                      fontSize: constants.mediumFontSize,
                    }}
                  >
                    {habit.habitCompletions.length}
                  </Text>
                  <Text
                    style={{
                      fontSize: constants.smallFontSize,
                      fontWeight: constants.fontWeight,
                    }}
                  >
                    Total
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: constants.fontWeight,
                      fontSize: constants.mediumFontSize,
                    }}
                  >
                    {habitScore}%
                  </Text>
                  <Text
                    style={{
                      fontSize: constants.smallFontSize,
                      fontWeight: constants.fontWeight,
                    }}
                  >
                    Score
                  </Text>
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
                  <Text
                    style={{
                      fontWeight: constants.fontWeight,
                      fontSize: constants.mediumFontSize,
                    }}
                  >
                    History
                  </Text>
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

              <Description description={habit.description} />
            </View>
          </>
        )}
      </ScrollView>
      {showDeleteModal && (
        <DeleteModal
          setShowModal={setShowDeleteModal}
          habitId={id.toString()}
          habitTitle={habit?.title}
        />
      )}
    </>
  );
}
