import { Pressable, View, Text, ScrollView, Switch } from "react-native";
import { SubmitHandler } from "react-hook-form";
import constants from "@/constants";
import React, { useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { maxFrequencyWeek, maxFrequencyMonth, daysMapping } from "@/data";
import { Day, Habit } from "@/types";
import { useAuthContext } from "@/contexts/AuthContext";
import getCalendarDays, {
  calculateHowManyTimesDidAHabitHaveToBeDoneBetweenTwoDates,
} from "@/utility";
import { StyleSheet } from "react-native";
import { HabitStartDateCalendar } from "@/components/utility/Calendar";
import LoadingComponent from "@/components/utility/Loading";
import { useHabitContext } from "@/contexts/HabitContext";
import EditHabitInputs from "./EditHabitInputs";

type Props = {
  id?: string;
};

const initialFrequency = 1;
const initialDaysState: Day[] = [];

export default function EditHabit({ id }: Props) {
  const router = useRouter();
  const { user } = useAuthContext();

  const { editHabitForm } = useHabitContext();
  const { setValue, handleSubmit } = editHabitForm;

  const [loading, setLoading] = useState(false);

  const [habit, setHabit] = useState<null | Habit>(null);

  const repetitions = ["Weekly", "Monthly"] as const;
  const [repetition, setRepetition] = useState<"Weekly" | "Monthly">("Weekly");

  const [daysState, setDaysState] = useState<number[]>(initialDaysState);

  const [maxFrequency, setMaxFrequency] = useState<number>(maxFrequencyWeek);
  const [frequency, setFrequency] = useState<number>(initialFrequency);
  const isMaxFrequency = frequency === maxFrequency;

  const [habitHasCustomStart, setHabitHasCustomStart] =
    useState<boolean>(false); // True if the habit we want to set a start date that is different from the current date
  const [customStartDate, setCustomStartDate] = useState<Date>(new Date());
  const [customStartCalendarDate, setCustomStartCalendarDate] = useState<Date>(
    new Date()
  );

  const { month: customStartCalendarMonth, year: customStartCalendarYear } =
    useMemo(() => {
      return {
        month: new Date(customStartCalendarDate).getMonth(),
        year: new Date(customStartCalendarDate).getFullYear(),
      };
    }, [customStartCalendarDate]);

  const allDaysInTheCustomDateMonth = useMemo(() => {
    return getCalendarDays(customStartCalendarYear, customStartCalendarMonth);
  }, [customStartCalendarYear, customStartCalendarMonth]);

  const onSubmit: SubmitHandler<any> = async (data) => {
    if (!id) {
      try {
        if (!user?.uid) throw new Error("Custom error: No user ID");
        await addDoc(collection(db, "habit"), {
          ...data,
          createdAt: habitHasCustomStart
            ? customStartDate.toUTCString()
            : new Date().toUTCString(),
          updatedAt: new Date().toUTCString(),
          lastFrequencyUpdate: new Date().toUTCString(),
          timesDoneBeforeFreqUpdate: 0,
          userId: user?.uid,
          habitCompletions: [],
          frequency: {
            type: repetition.toLowerCase(),
            days: daysState, // For now days is only for weekly habits (To change in the future)
            occurrences: frequency, // For now occurrences is only for monthly habits (To change in the future)
          },
        });

        router.push("/");
      } catch (error: any) {
        console.error(error.message);
      }
    } else {
      try {
        if (!habit) return;

        const lastFreqUpdateDate = new Date(
          habit.lastFrequencyUpdate
        ).getTime();
        const currentDate = new Date().getTime();

        const habitHasBeenCompletedSinceLastFreqUpdate =
          habit.habitCompletions.some(
            (c) => new Date(c).getTime() > lastFreqUpdateDate
          );
        const habitFrequencyHasChanged =
          habit.frequency.days !== daysState ||
          habit.frequency.occurrences !== frequency;

        const lastFrequencyUpdateMustBeModified =
          habitFrequencyHasChanged && habitHasBeenCompletedSinceLastFreqUpdate;

        let timesDoneSinceLastUpdate =
          calculateHowManyTimesDidAHabitHaveToBeDoneBetweenTwoDates(
            habit,
            lastFreqUpdateDate,
            currentDate
          ); // How many times it had to be done between the last update and now

        await updateDoc(doc(db, "habit", id), {
          ...data,
          updatedAt: new Date().toUTCString(),
          lastFrequencyUpdate: lastFrequencyUpdateMustBeModified
            ? new Date().toDateString()
            : habit?.lastFrequencyUpdate,
          timesDoneBeforeFreqUpdate: lastFrequencyUpdateMustBeModified
            ? habit?.timesDoneBeforeFreqUpdate + timesDoneSinceLastUpdate
            : habit?.timesDoneBeforeFreqUpdate,
          frequency: {
            type: repetition?.toLowerCase(),
            days: daysState, // For now days is only for weekly (To change in the future)
            occurrences: frequency, // For now occurrences is only for monthly (To change in the future),
            createdAt: habitHasCustomStart
              ? customStartDate.toUTCString()
              : habit?.createdAt,
          },
        });
        router.push(`/habit?id=${id}`);
      } catch (error: any) {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (!id) {
      if (repetition === "Weekly") {
        setMaxFrequency(maxFrequencyWeek);
        setFrequency(initialFrequency);
      } else {
        setMaxFrequency(maxFrequencyMonth);
        setFrequency(initialFrequency);
      }
    }
  }, [repetition]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      const docRef = doc(db, "habit", id.toString());

      getDoc(docRef)
        .then((doc) => {
          if (doc.exists()) {
            const docData = doc.data() as Habit;
            setHabit(docData);

            setValue("title", docData.title);
            setValue("description", docData.description);

            setRepetition(
              docData.frequency.type === "weekly" ? "Weekly" : "Monthly"
            );
            setFrequency(docData.frequency.occurrences || initialFrequency);
            setDaysState(docData.frequency.days || initialDaysState);

            if (docData.frequency.type === "weekly") {
              setMaxFrequency(maxFrequencyWeek);
            } else {
              setMaxFrequency(maxFrequencyMonth);
            }
          } else {
            throw new Error("The doc doesn't exist");
          }
        })
        .catch((e) => {
          console.log(e.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  if (loading)
    return <LoadingComponent size={80} color={constants.colorPrimary} />;

  return (
    <ScrollView>
      <EditHabitInputs />

      {/* Repetition */}
      <View style={styles.page_block}>
        <View style={styles.repeat_block_title_container}>
          <Text style={styles.repeat_block_title}>Repeat</Text>
        </View>
        <View style={styles.repeat_block_switch_container}>
          {repetitions.map((f) => (
            <Pressable
              key={f}
              onPress={() => setRepetition(f)}
              style={{
                flexGrow: 1,
                margin: constants.margin,
                backgroundColor:
                  f === repetition
                    ? constants.colorSecondary
                    : constants.colorPrimary,
                borderRadius: 10,
                padding: constants.padding / 2,
              }}
            >
              <Text style={styles.repeat_switch_option_text}>{f}</Text>
            </Pressable>
          ))}
        </View>

        {repetition === "Weekly" ? (
          <View style={styles.weekly_rep_block_container}>
            <Text style={styles.bold_text}>On these days</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: constants.padding * 1.5,
              }}
            >
              {Object.keys(daysMapping)
                .map((k) => Number(k) as Day)
                .sort((a: Day, b: Day) => {
                  return daysMapping[a].order - daysMapping[b].order;
                })
                .map((d) => {
                  const repeat = daysState.includes(d);
                  const key = daysMapping[d].key;

                  return (
                    <Pressable
                      key={d.toString()}
                      style={{
                        flexGrow: 1,
                        borderRadius: 5,
                        backgroundColor: repeat
                          ? constants.colorPrimary
                          : constants.colorSecondary,
                        padding: constants.padding / 2,
                      }}
                      onPress={() => {
                        let daysCopy = _.clone(daysState) as Day[];
                        if (repeat) {
                          daysCopy = daysCopy.filter((k) => k !== d);
                        } else {
                          daysCopy.push(d);
                        }
                        setDaysState(daysCopy);
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          color: repeat
                            ? constants.colorSecondary
                            : constants.colorTertiary,
                        }}
                      >
                        {key}
                      </Text>
                    </Pressable>
                  );
                })}
            </View>
          </View>
        ) : (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                gap: constants.padding,
              }}
            >
              <Text style={styles.bold_text}>Frequency</Text>
              <Text>
                {isMaxFrequency
                  ? "Everyday"
                  : `${frequency} times per ${"month"}`}
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                borderColor: "transparent", // The element is spaced correctly when I add a border
                borderWidth: 0.1,
                gap: constants.padding,
              }}
            >
              <Pressable
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
                disabled={frequency === 1}
                onPress={() => setFrequency(frequency - 1)}
              >
                <Text
                  style={{
                    fontWeight: "700",
                    backgroundColor:
                      frequency === 1
                        ? constants.colorQuinary
                        : constants.colorPrimary,
                    color: constants.colorSecondary,
                    padding: constants.padding,
                    borderRadius: 5,
                    textAlign: "center",
                    minWidth: constants.padding * 3,
                  }}
                >
                  -
                </Text>
              </Pressable>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: constants.mediumFontSize,
                  }}
                >
                  {frequency}
                </Text>
              </View>
              <Pressable
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
                disabled={isMaxFrequency}
                onPress={() => setFrequency(frequency + 1)}
              >
                <Text
                  style={{
                    fontWeight: "700",
                    backgroundColor: isMaxFrequency
                      ? constants.colorQuinary
                      : constants.colorPrimary,
                    color: constants.colorSecondary,
                    padding: constants.padding,
                    borderRadius: 5,
                    textAlign: "center",
                    minWidth: constants.padding * 3,
                  }}
                >
                  +
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      <View style={styles.page_block}>
        <View style={styles.habit_start_text_container}>
          <Text style={styles.habit_start_text}>Habit to start now?</Text>
          <Switch
            value={habitHasCustomStart}
            onValueChange={() => {
              setHabitHasCustomStart(!habitHasCustomStart);
            }}
            trackColor={{
              false: constants.colorQuinary,
              true: constants.colorPrimary,
            }}
            thumbColor={constants.colorSecondary}
          />
        </View>
        {habitHasCustomStart && (
          <HabitStartDateCalendar
            calendarMonth={customStartCalendarMonth}
            calendarYear={customStartCalendarYear}
            days={allDaysInTheCustomDateMonth}
            customStartDate={customStartDate}
            setCustomStartDate={setCustomStartDate}
            setCalendarDate={setCustomStartCalendarDate}
          />
        )}
      </View>

      {/*Submit button*/}
      <Pressable style={styles.save_button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.save_button_text}>Save</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page_block: {
    backgroundColor: constants.colorSecondary,
    margin: constants.padding,
    padding: constants.padding,
    borderRadius: 10,
  },
  repeat_block_title_container: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: constants.padding,
  },
  repeat_block_title: {
    fontSize: constants.mediumFontSize,
    fontWeight: constants.fontWeight,
  },
  repeat_block_switch_container: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: constants.colorPrimary,
    borderRadius: 10,
    marginBottom: constants.padding * 3,
  },
  repeat_switch_option_text: {
    fontWeight: constants.fontWeight,
    textAlign: "center",
  },
  weekly_rep_block_container: {
    display: "flex",
    gap: constants.margin * 5,
  },
  bold_text: {
    fontWeight: constants.fontWeight,
  },
  habit_start_text_container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: constants.padding,
  },
  habit_start_text: {
    fontWeight: constants.fontWeight,
  },
  save_button: {
    backgroundColor: constants.colorPrimary,
    margin: constants.padding,
    borderRadius: 10,
    padding: constants.padding,
  },
  save_button_text: {
    textAlign: "center",
    fontWeight: constants.fontWeight,
    fontSize: constants.mediumFontSize,
    color: constants.colorSecondary,
  },
});
