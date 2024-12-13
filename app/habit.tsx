import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Habit } from "./types";
import constants from "./constants";
import { days, monthObject } from "./data";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HabitPage() {
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

  const allDaysInTheMonth = useMemo(() => {
    const minNbOfDaysInAMonth = 27; // Because we start counting from 0
    let nbOfDaysInTheMonth = minNbOfDaysInAMonth;
    let currentMonth = month;

    while (currentMonth === month) {
      const newDate = new Date(year, month, nbOfDaysInTheMonth);
      // Add 24 hours in milliseconds
      newDate.setTime(newDate.getTime() + 24 * 60 * 60 * 1000);

      currentMonth = newDate.getMonth();
      currentMonth === month && nbOfDaysInTheMonth++;
    }

    const arrayDaysInTheMonth = Array.from(
      { length: nbOfDaysInTheMonth },
      (_, index) => {
        const date = new Date(year, month, index + 1);

        return {
          date,
          weekday: date.getDay(),
          monthday: index + 1,
          year: year,
        };
      }
    );

    // add days from the previous month to complete the 1st week

    while (arrayDaysInTheMonth[0].weekday !== 1) {
      const previousDay = new Date(
        arrayDaysInTheMonth[0].date.setTime(
          arrayDaysInTheMonth[0].date.getTime() - 24 * 60 * 60 * 1000
        )
      );
      arrayDaysInTheMonth.unshift({
        date: previousDay,
        weekday: previousDay.getDay(),
        monthday: previousDay.getDate(),
        year: previousDay.getFullYear(),
      });
    }

    // add days to have 42 days in the Array

    while (arrayDaysInTheMonth.length < 42) {
      const arrayIdxLastItem = arrayDaysInTheMonth.length - 1;
      const lastDate = arrayDaysInTheMonth[arrayIdxLastItem].date;
      const nextDay = new Date(
        lastDate.setTime(lastDate.getTime() + 24 * 60 * 60 * 1000)
      );
      arrayDaysInTheMonth.push({
        date: nextDay,
        weekday: nextDay.getDay(),
        monthday: nextDay.getDate(),
        year: nextDay.getFullYear(),
      });
    }

    return arrayDaysInTheMonth;
  }, [month]);

  useEffect(() => {
    const docRef = doc(db, "habit", id.toString());
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
      });
    setLoading(false);
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {loading ? (
        <Text>Loading ...</Text>
      ) : error || !habit ? (
        <Text>An error occured ...</Text>
      ) : (
        <View
          style={{
            flex: 1,
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
                0
              </Text>
              <Text
                style={{
                  fontSize: constants.mediumFontSize,
                }}
              >
                Total
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
              }}
            >
              <Text
                style={{
                  fontWeight: constants.fontWeight,
                }}
              >
                History
              </Text>
              <View>
                <Text
                  style={{
                    fontWeight: constants.fontWeight,
                  }}
                >
                  {monthObject[month]} {year}
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
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
                {Object.keys(days).map((day) => {
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
                        }}
                      >
                        {days[day as keyof typeof days].key}
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
                  rowGap: constants.margin * 5,
                }}
              >
                {allDaysInTheMonth.map((d, i) => {
                  return (
                    <View
                      key={d.date.toString() + i}
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
                          backgroundColor: "lightblue",
                          borderRadius: 50,
                        }}
                      >
                        <Text
                          style={{
                            textAlign: "center",
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
        </View>
      )}
    </View>
  );
}
