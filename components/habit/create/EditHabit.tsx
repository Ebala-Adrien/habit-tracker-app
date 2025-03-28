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
          console.error(e.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  if (loading)
    return <LoadingComponent size={80} color={constants.colorPrimary} />;

  return (
    <ScrollView style={styles.container}>
      <EditHabitInputs />

      {/* Repetition Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Repeat</Text>
        <View style={styles.repeatTypeContainer}>
          {repetitions.map((f) => (
            <Pressable
              key={f}
              onPress={() => setRepetition(f)}
              style={[
                styles.repeatTypeButton,
                f === repetition && styles.repeatTypeButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.repeatTypeText,
                  f === repetition && styles.repeatTypeTextActive,
                ]}
              >
                {f}
              </Text>
            </Pressable>
          ))}
        </View>

        {repetition === "Weekly" ? (
          <View style={styles.weeklyContainer}>
            <Text style={styles.subsectionTitle}>Select Days</Text>
            <View style={styles.daysContainer}>
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
                      style={[
                        styles.dayButton,
                        repeat && styles.dayButtonActive,
                      ]}
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
                        style={[
                          styles.dayButtonText,
                          repeat && styles.dayButtonTextActive,
                        ]}
                      >
                        {key}
                      </Text>
                    </Pressable>
                  );
                })}
            </View>
          </View>
        ) : (
          <View style={styles.monthlyContainer}>
            <Text style={styles.subsectionTitle}>Frequency</Text>
            <View style={styles.frequencyContainer}>
              <Text style={styles.frequencyText}>
                {isMaxFrequency ? "Everyday" : `${frequency} times per month`}
              </Text>
              <View style={styles.frequencyControls}>
                <Pressable
                  style={[
                    styles.frequencyButton,
                    frequency === 1 && styles.frequencyButtonDisabled,
                  ]}
                  disabled={frequency === 1}
                  onPress={() => setFrequency(frequency - 1)}
                >
                  <Text style={styles.frequencyButtonText}>-</Text>
                </Pressable>
                <Text style={styles.frequencyValue}>{frequency}</Text>
                <Pressable
                  style={[
                    styles.frequencyButton,
                    isMaxFrequency && styles.frequencyButtonDisabled,
                  ]}
                  disabled={isMaxFrequency}
                  onPress={() => setFrequency(frequency + 1)}
                >
                  <Text style={styles.frequencyButtonText}>+</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Start Date Section */}
      <View style={styles.section}>
        <View style={styles.startDateHeader}>
          <Text style={styles.sectionTitle}>Start Date</Text>
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

      <Pressable style={styles.saveButton} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.saveButtonText}>Save Habit</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: constants.colorQuaternary,
  },
  section: {
    backgroundColor: constants.colorSecondary,
    margin: constants.padding,
    padding: constants.padding * 1.5,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: constants.mediumFontSize * 1.1,
    fontWeight: "700",
    marginBottom: constants.padding * 1.5,
    color: constants.colorTertiary,
  },
  subsectionTitle: {
    fontSize: constants.mediumFontSize,
    fontWeight: "600",
    marginBottom: constants.padding,
    color: constants.colorTertiary,
  },
  repeatTypeContainer: {
    flexDirection: "row",
    backgroundColor: constants.colorQuaternary,
    borderRadius: 12,
    padding: 4,
  },
  repeatTypeButton: {
    flex: 1,
    paddingVertical: constants.padding,
    borderRadius: 10,
  },
  repeatTypeButtonActive: {
    backgroundColor: constants.colorPrimary,
  },
  repeatTypeText: {
    textAlign: "center",
    fontWeight: "600",
    color: constants.colorTertiary,
  },
  repeatTypeTextActive: {
    color: constants.colorSecondary,
  },
  weeklyContainer: {
    marginTop: constants.padding * 2,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 6,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: constants.colorQuaternary,
    justifyContent: "center",
    alignItems: "center",
  },
  dayButtonActive: {
    backgroundColor: constants.colorPrimary,
  },
  dayButtonText: {
    fontWeight: "600",
    color: constants.colorTertiary,
    textAlign: "center",
    fontSize: constants.smallFontSize,
  },
  dayButtonTextActive: {
    color: constants.colorSecondary,
  },
  monthlyContainer: {
    marginTop: constants.padding * 2,
  },
  frequencyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  frequencyText: {
    fontSize: constants.mediumFontSize,
    color: constants.colorTertiary,
  },
  frequencyControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: constants.colorQuaternary,
    borderRadius: 10,
    padding: 4,
  },
  frequencyButton: {
    backgroundColor: constants.colorPrimary,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  frequencyButtonDisabled: {
    backgroundColor: constants.colorQuinary,
    opacity: 0.5,
  },
  frequencyButtonText: {
    color: constants.colorSecondary,
    fontSize: constants.mediumFontSize,
    fontWeight: "700",
  },
  frequencyValue: {
    fontSize: constants.mediumFontSize,
    fontWeight: "600",
    marginHorizontal: constants.padding * 1.5,
    color: constants.colorTertiary,
  },
  startDateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: constants.colorPrimary,
    margin: constants.padding,
    marginBottom: constants.padding * 2,
    borderRadius: 15,
    padding: constants.padding * 1.2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: constants.mediumFontSize,
    color: constants.colorSecondary,
  },
});
