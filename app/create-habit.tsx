import { View, Text, TextInput, Switch, Pressable, Button } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import constants from "./constants";
import { useState } from "react";
import _ from "lodash";

// Validation schema
const schema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string(),
  isRepetitive: Yup.boolean(),
});

type Days = {
  Monday: { key: "M"; repeat: boolean };
  Tuesday: { key: "T"; repeat: boolean };
  Wednesday: { key: "W"; repeat: boolean };
  Thursday: { key: "T"; repeat: boolean };
  Friday: { key: "F"; repeat: boolean };
  Saturday: { key: "S"; repeat: boolean };
  Sunday: { key: "S"; repeat: boolean };
};

export default function CreateHabit() {
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

  const days: Days = {
    Monday: { key: "M", repeat: true },
    Tuesday: { key: "T", repeat: true },
    Wednesday: { key: "W", repeat: true },
    Thursday: { key: "T", repeat: true },
    Friday: { key: "F", repeat: true },
    Saturday: { key: "S", repeat: true },
    Sunday: { key: "S", repeat: true },
  };

  const [daysState, setDaysState] = useState<Days>(days);

  return (
    <View>
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
              {Object.keys(daysState as Days).map((d) => {
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
          <Text>"Test"</Text>
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
    </View>
  );
}
