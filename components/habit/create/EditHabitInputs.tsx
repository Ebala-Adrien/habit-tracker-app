import { Controller } from "react-hook-form";
import { TextInput, StyleSheet, Text, View } from "react-native";
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
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              {i.name.charAt(0).toUpperCase() + i.name.slice(1)}
            </Text>
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
              <Text style={styles.errorText}>
                {/* @ts-ignore */}
                {errors[i.name].message}
              </Text>
            )}
          </View>
        </Fragment>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: constants.padding,
    marginTop: constants.padding,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: constants.colorTertiary,
    marginLeft: constants.padding * 2,
    marginBottom: constants.padding / 2,
  },
  title_input: {
    backgroundColor: constants.colorSecondary,
    marginHorizontal: constants.padding,
    padding: constants.padding * 1.5,
    fontSize: constants.mediumFontSize,
    fontWeight: constants.fontWeight,
    borderRadius: 10,
  },
  description_input: {
    backgroundColor: constants.colorSecondary,
    marginHorizontal: constants.padding,
    padding: constants.padding * 1.5,
    fontSize: constants.mediumFontSize,
    fontWeight: constants.fontWeight,
    borderRadius: 10,
    minHeight: constants.padding * 10,
    textAlignVertical: "top",
  },
  errorText: {
    color: constants.colorError,
    marginHorizontal: constants.padding * 2,
    marginTop: constants.padding / 2,
    fontSize: 14,
  },
});
