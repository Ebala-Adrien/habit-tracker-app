import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { db } from "@/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Day, Habit } from "./types";
import constants from "./constants";
import { daysMapping, monthObject } from "./data";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  calculateHowManyTimesDidAHabitHaveToBeDoneBetweenTwoDates,
  compareDates,
} from "./utility";
import Description from "./components/habit/display/Description";
import LoadingComponent from "./components/utility/Loading";
import ErrorComponent from "./components/utility/Error";
import { useRouter } from "expo-router";
import DeleteModal from "./components/habit/modal/DeleteHabit";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

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
    const TOTAL_DAYS = 42; // 6 weeks * 7 days

    // Helper to create a new date without mutation
    const createDate = (y: number, m: number, d: number) => new Date(y, m, d);

    // Get the first day of the given month
    const firstDayOfMonth = createDate(year, month, 1);

    // Determine the weekday of the first day of the month (0 = Sunday, 1 = Monday, ...)
    const firstWeekday = (firstDayOfMonth.getDay() + 6) % 7; // Adjust to start on Monday

    // Calculate the start date for the calendar (Monday of the first week)
    const calendarStartDate = new Date(
      firstDayOfMonth.getTime() - firstWeekday * 24 * 60 * 60 * 1000
    );

    // Generate the array of 42 days
    const calendarDays = Array.from({ length: TOTAL_DAYS }, (_, index) => {
      const currentDate = new Date(
        calendarStartDate.getTime() + index * 24 * 60 * 60 * 1000
      );
      return {
        date: currentDate,
        weekday: currentDate.getDay(),
        monthday: currentDate.getDate(),
        year: currentDate.getFullYear(),
        isCurrentMonth: currentDate.getMonth() === month,
      };
    });

    return calendarDays;
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
        console.log(e.message);
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
                </View>
                <View
                  style={{
                    backgroundColor: constants.colorSecondary,
                    borderRadius: 10,
                    padding: constants.padding,
                  }}
                >
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
                    {allDaysInTheMonth.map((d, i) => {
                      const occurred = habit.habitCompletions?.find(
                        (o: string) => {
                          return compareDates(new Date(o), d.date);
                        }
                      );

                      const dateNotFromCurrentMonth =
                        d.date.getMonth() !==
                        new Date(year, month, 10).getMonth();
                      const futureDate =
                        d.date.getTime() > new Date().getTime();

                      return (
                        <View
                          key={d.date.toUTCString() + i}
                          style={{
                            borderRadius: 50,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: `${(1 / 7) * 100}%`,
                            height: 50,
                          }}
                        >
                          <Pressable
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "85%",
                              height: "85%",
                              borderWidth: compareDates(d.date, new Date())
                                ? 2
                                : 0,
                              borderColor: constants.colorQuarternary,
                              borderRadius: 50,
                              backgroundColor: occurred
                                ? constants.colorQuinary
                                : constants.colorSecondary,
                            }}
                            disabled={futureDate}
                            onPress={() => {
                              if (occurred) {
                                setHabit({
                                  ...habit,
                                  habitCompletions: [
                                    ...habit.habitCompletions,
                                  ].filter(
                                    (o) => !compareDates(new Date(o), d.date)
                                  ),
                                });
                              } else {
                                setHabit({
                                  ...habit,
                                  habitCompletions: [
                                    ...habit.habitCompletions,
                                    d.date.toUTCString(),
                                  ].sort(
                                    (d1, d2) =>
                                      new Date(d1).valueOf() -
                                      new Date(d2).valueOf()
                                  ),
                                });
                              }
                            }}
                          >
                            <Text
                              style={{
                                textAlign: "center",
                                color:
                                  futureDate || dateNotFromCurrentMonth
                                    ? constants.colorPrimary
                                    : constants.colorTertiary,
                              }}
                            >
                              {d.monthday}
                            </Text>
                          </Pressable>
                        </View>
                      );
                    })}
                  </View>
                </View>
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
