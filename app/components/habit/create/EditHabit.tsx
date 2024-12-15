import {
  Pressable,
  View,
  TextInput,
  Text,
  Switch,
  ScrollView,
} from "react-native";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import constants from "@/app/constants";
import { useEffect, useState } from "react";
import _ from "lodash";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { Days, days, maxFrequencyWeek, maxFrequencyMonth } from "@/app/data";
import { Habit } from "@/app/types";

type Props = {
  id?: string;
};

// Validation schema
const schema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string(),
  isRepetitive: Yup.boolean().default(true),
});

export default function EditHabit({ id }: Props) {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const repetitions = ["Daily", "Weekly", "Monthly"] as const;
  const [repetition, setRepetition] = useState<
    null | "Daily" | "Weekly" | "Monthly"
  >("Daily");

  const [daysState, setDaysState] = useState<Days>(days);
  const [maxFrequency, setMaxFrequency] = useState<number>(maxFrequencyWeek);
  const [frequency, setFrequency] = useState<number>(maxFrequency);
  const isMaxFrequency = frequency === maxFrequency;
  const [loading, setLoading] = useState(false);

  // Can remove any in the future
  const onSubmit: SubmitHandler<any> = async (data) => {
    if (!id) {
      try {
        await addDoc(collection(db, "habit"), {
          ...data,
          occurrences: [],
          frequency: !data.isRepetitive
            ? undefined
            : repetition === "Daily"
            ? {
                repetition,
                frequency: daysState,
              }
            : {
                repetition,
                frequency,
              },
        });

        router.push("/");
      } catch (error: any) {
        console.error(error.message);
      }
    } else {
      try {
        await updateDoc(doc(db, "habit", id), {
          ...data,
          frequency: !data.isRepetitive
            ? undefined
            : repetition === "Daily"
            ? {
                repetition,
                frequency: daysState,
              }
            : {
                repetition,
                frequency,
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
        setFrequency(maxFrequencyWeek);
      } else {
        setMaxFrequency(maxFrequencyMonth);
        setFrequency(maxFrequencyMonth);
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
            setValue("title", docData.title);
            setValue("description", docData.description);
            setValue("isRepetitive", docData.isRepetitive);

            if (docData.isRepetitive) {
              setRepetition(docData.frequency.repetition);
              // @ts-ignore
              setFrequency(docData.frequency.frequency);
              if (docData.frequency.repetition === "Daily") {
                setDaysState(docData.frequency.frequency);
              } else if (docData.frequency.repetition === "Weekly") {
                setMaxFrequency(maxFrequencyWeek);
              } else {
                setMaxFrequency(maxFrequencyMonth);
              }
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
          <Switch
            trackColor={{
              false: constants.colorPrimary,
              true: constants.colorQuarternary,
            }} // Track color
            thumbColor={constants.colorSecondary} // Thumb color
            onValueChange={() =>
              setValue("isRepetitive", !watch("isRepetitive"))
            } // Function to toggle state
            value={watch("isRepetitive")} // Current state
          />
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

        {repetition === "Daily" ? (
          <View>
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
              {(Object.keys(daysState) as (keyof Days)[])
                .sort((a: keyof Days, b: keyof Days) => {
                  const daysArray = Object.keys(days) as (keyof Days)[];

                  return daysArray.indexOf(a) - daysArray.indexOf(b);
                })
                .map((d) => {
                  const { key, repeat } = daysState[d as keyof Days];

                  return (
                    <Pressable
                      key={d}
                      style={{
                        flexGrow: 1,
                        borderRadius: 5,
                        backgroundColor: repeat
                          ? constants.colorQuarternary
                          : constants.colorSecondary,
                        padding: constants.padding / 2,
                      }}
                      onPress={() => {
                        const daysCopy = _.clone(daysState) as Days;
                        daysCopy[d as keyof Days] = {
                          ...daysCopy[d as keyof Days],
                          // @ts-ignore
                          repeat: !daysCopy[d as keyof Days].repeat,
                        };
                        setDaysState(daysCopy);
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
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
                  : `${frequency} times per ${
                      repetition === "Weekly" ? "week" : "month"
                    }`}
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
                    backgroundColor: frequency === 1 ? "lightgreen" : "lime",
                    color: frequency === 1 ? "white" : "green",
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
                    backgroundColor: isMaxFrequency ? "lightgreen" : "lime",
                    color: isMaxFrequency ? "white" : "green",
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
