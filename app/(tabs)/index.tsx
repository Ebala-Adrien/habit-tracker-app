import { View, Text, Pressable, StyleSheet } from "react-native";
import constants from "../../constants";
import React, { useEffect, useState } from "react";
import { useHabitContext } from "../../contexts/HabitContext";
import { useAuthContext } from "../../contexts/AuthContext";
import HabitList from "../../components/habit/display/HabitList";
import { useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import LoadingComponent from "../../components/utility/Loading";

export default function HomeScreen() {
  const frequences = ["Day", "Week", "Month", "Overall"] as const;
  const [frequence, setFrequence] = useState<
    "Day" | "Week" | "Month" | "Overall"
  >(frequences[0]);

  const { habits } = useHabitContext();
  const { authCtxIsLoading } = useAuthContext();
  const { deleteHabitMsg } = useLocalSearchParams();

  useEffect(() => {
    if (deleteHabitMsg) {
      Toast.show({
        text1: deleteHabitMsg.toString(),
        position: "bottom",
        bottomOffset: 60,
        type: "deletedHabitToast",
      });
    }
  }, [deleteHabitMsg]);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {authCtxIsLoading ? (
        <LoadingComponent size={80} color={constants.colorQuarternary} />
      ) : (
        <>
          <Text style={styles.page_title}>Habits</Text>
          <View style={styles.frequences_container}>
            {frequences.map((r) => {
              const isCurrentFrequence = frequence === r;

              return (
                <Pressable key={r} onPress={() => setFrequence(r)}>
                  <Text
                    style={{
                      fontWeight: "500",
                      fontSize: constants.mediumFontSize,
                      color: isCurrentFrequence ? "black" : "grey",
                      backgroundColor: isCurrentFrequence
                        ? "white"
                        : "transparent",
                      paddingHorizontal: constants.padding * 2,
                      paddingVertical: constants.padding,
                      borderRadius: 50,
                    }}
                    key={r}
                  >
                    {r}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <HabitList habits={habits} frequence={frequence} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page_title: {
    fontSize: constants.largeFontSize,
    fontWeight: constants.fontWeight,
    padding: constants.padding,
  },
  frequences_container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: constants.padding,
    marginBottom: constants.margin * 10,
  },
});
