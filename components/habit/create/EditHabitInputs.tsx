import { Controller } from "react-hook-form";
import { TextInput, StyleSheet, Text } from "react-native";
import { useHabitContext } from "@/contexts/HabitContext";
import React, { Fragment } from "react";
import constants from "@/constants";
import { habitAndTaskFormInputsData } from "@/data";

export default function EditHabitInputs({}) {
  const { editHabitForm } = useHabitContext();
  const {
    control,
    formState: { errors },
  } = editHabitForm;

  return (
    <>
      {habitAndTaskFormInputsData.map((i) => (
        <Fragment key={i.name}>
          <Controller
            key={i.name}
            name={i.name}
            control={control}
            defaultValue=""
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={
                  i.name === "title"
                    ? styles.title_input
                    : styles.description_input
                }
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder={i.placeholder}
                multiline={i.name === "description" ? true : false}
              />
            )}
          />
          {errors[i.name] && (
            <Text
              style={{
                color: constants.colorError,
                marginHorizontal: constants.padding,
                marginBottom: constants.padding,
                paddingHorizontal: constants.padding,
              }}
            >
              {/* @ts-ignore */}
              {errors[i.name].message}
            </Text>
          )}
        </Fragment>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  title_input: {
    backgroundColor: constants.colorSecondary,
    margin: constants.padding,
    padding: constants.padding,
    fontSize: constants.mediumFontSize,
    fontWeight: constants.fontWeight,
    borderRadius: 10,
  },
  description_input: {
    backgroundColor: constants.colorSecondary,
    margin: constants.padding,
    padding: constants.padding,
    fontSize: constants.mediumFontSize,
    fontWeight: constants.fontWeight,
    borderRadius: 10,
    minHeight: constants.padding * 10,
    textAlignVertical: "top",
  },
});
