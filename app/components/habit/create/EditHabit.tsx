import { Pressable, View, TextInput, Text, ScrollView } from "react-native";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import constants from "@/app/constants";
import { useEffect, useState } from "react";
import _ from "lodash";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { maxFrequencyWeek, maxFrequencyMonth, daysMapping } from "@/app/data";
import { Day, Habit } from "@/app/types";
import { useAuthContext } from "@/app/contexts/AuthContext";
import { calculateHowManyTimesDidAHabitHaveToBeDoneBetweenTwoDates } from "@/app/utility";

type Props = {
  id?: string;
};

const schema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string(),
});

const initialFrequency = 1;
const initialDaysState: Day[] = [];

export default function EditHabit({ id }: Props) {
  const router = useRouter();
  const { user } = useAuthContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [habit, setHabit] = useState<null | Habit>(null);

  const repetitions = ["Weekly", "Monthly"] as const;
  const [repetition, setRepetition] = useState<"Weekly" | "Monthly">("Weekly");

  const [daysState, setDaysState] = useState<number[]>(initialDaysState);
  const [maxFrequency, setMaxFrequency] = useState<number>(maxFrequencyWeek);
  const [frequency, setFrequency] = useState<number>(initialFrequency);
  const isMaxFrequency = frequency === maxFrequency;
  const [loading, setLoading] = useState(false);

  // Can remove any in the future
  const onSubmit: SubmitHandler<any> = async (data) => {
    if (!id) {
      try {
        if (!user?.uid) throw new Error("Custom error: No user ID");

        await addDoc(collection(db, "habit"), {
          ...data,
          createdAt: new Date().toUTCString(),
          updatedAt: new Date().toUTCString(),
          lastFrequencyUpdate: new Date().toUTCString(),
          timesDoneBeforeFreqUpdate: 0,
          userId: user?.uid,
          habitCompletions: [],
          frequency: {
            type: repetition.toLowerCase(),
            days: daysState, // For now days is only for weekly (To change in the future)
            occurences: frequency, // For now occurences is only for monthly (To change in the future)
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
            occurences: frequency, // For now occurences is only for monthly (To change in the future)
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

            // @ts-ignore
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

  if (loading) return <Text>Loading...</Text>;

  return (
    <ScrollView>
      <Controller
        name="title"
        control={control}
        defaultValue=""
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Title"
            style={{
              backgroundColor: constants.colorPrimary,
              margin: constants.padding,
              padding: constants.padding,
              fontSize: constants.mediumFontSize,
              fontWeight: constants.fontWeight,
              borderRadius: 10,
            }}
          />
        )}
      />
      {errors["title"] && (
        <Text
          style={{
            color: constants.colorError,
            marginHorizontal: constants.padding,
            marginBottom: constants.padding,
            paddingHorizontal: constants.padding,
          }}
        >
          {errors["title"].message}
        </Text>
      )}

      <Controller
        name="description"
        control={control}
        defaultValue=""
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Description"
            multiline
            style={{
              backgroundColor: constants.colorPrimary,
              margin: constants.padding,
              padding: constants.padding,
              fontSize: constants.mediumFontSize,
              fontWeight: constants.fontWeight,
              borderRadius: 10,
              minHeight: constants.padding * 10,
              textAlignVertical: "top",
            }}
          />
        )}
      />

      {/* Repetition */}
      <View
        style={{
          backgroundColor: constants.colorSecondary,
          margin: constants.padding,
          padding: constants.padding,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: constants.padding,
          }}
        >
          <Text
            style={{
              fontSize: constants.mediumFontSize,
              fontWeight: constants.fontWeight,
            }}
          >
            Repeat
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: constants.colorPrimary,
            borderRadius: 10,
            marginBottom: constants.padding * 3,
          }}
        >
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
              <Text
                style={{
                  fontWeight: constants.fontWeight,
                  textAlign: "center",
                }}
              >
                {f}
              </Text>
            </Pressable>
          ))}
        </View>

        {repetition === "Weekly" ? (
          <View
            style={{
              display: "flex",
              gap: constants.margin * 5,
            }}
          >
            <Text
              style={{
                fontWeight: constants.fontWeight,
              }}
            >
              On these days
            </Text>
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
                          ? constants.colorQuarternary
                          : constants.colorSecondary,
                        padding: constants.padding / 2,
                      }}
                      onPress={() => {
                        console.log("On va voir");
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
              <Text
                style={{
                  fontWeight: constants.fontWeight,
                }}
              >
                Frequency
              </Text>
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
                        : constants.colorQuarternary,
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
                      : constants.colorQuarternary,
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

      {/*Completion*/}

      {/*Submit button*/}
      <Pressable
        style={{
          backgroundColor: constants.colorQuarternary,
          margin: constants.padding,
          borderRadius: 10,
          padding: constants.padding,
        }}
        onPress={handleSubmit(onSubmit)}
      >
        <Text
          style={{
            textAlign: "center",
            fontWeight: constants.fontWeight,
            fontSize: constants.mediumFontSize,
            color: constants.colorSecondary,
          }}
        >
          Save
        </Text>
      </Pressable>
    </ScrollView>
  );
}
