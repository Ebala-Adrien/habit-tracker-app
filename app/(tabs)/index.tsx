import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import constants from "../../constants";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import LoadingComponent from "../../components/utility/Loading";
import Entypo from "@expo/vector-icons/Entypo";
import { useMenuContext } from "@/contexts/MenuContext";
import Checkbox from "react-native-bouncy-checkbox";
import TaskList from "@/components/task/display/TaskList";
import HabitAndTaskList from "@/components/habit_or_task/display/HabitAndTaskList";

export default function HomeScreen() {
  const frequences = ["Day", "Week", "Month", "Overall"] as const;
  const [frequence, setFrequence] = useState<
    "Day" | "Week" | "Month" | "Overall"
  >(frequences[0]);

  const { showFilter, setShowCreateTaskOrHabitModal } = useMenuContext();
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
          {showFilter && (
            <View
              style={{
                position: "absolute",
                backgroundColor: constants.colorSecondary,
                width: "50%",
                right: 0,
                flex: 1,
                borderRadius: 5,
                padding: constants.padding,
                borderColor: constants.colorTertiary,
                borderWidth: 1,
                zIndex: 100,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontWeight: constants.fontWeight }}>Habits</Text>
                <Checkbox size={20} isChecked={true} />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontWeight: constants.fontWeight }}>Tasks</Text>
                <Checkbox size={20} isChecked={true} />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontWeight: constants.fontWeight }}>
                  Archived
                </Text>
                <Checkbox size={20} />
              </View>
            </View>
          )}

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

          <ScrollView
            style={{
              paddingHorizontal: constants.padding * 2,
            }}
          >
            <HabitAndTaskList frequence={frequence} />
          </ScrollView>

          <View
            style={{
              position: "fixed",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              paddingBottom: constants.padding,
              paddingRight: constants.padding,
              left: "100%",
              transform: [{ translateX: "-100%" }],
              height: 50,
              width: 50,
            }}
          >
            <Pressable
              onPress={() => setShowCreateTaskOrHabitModal(true)}
              style={{
                backgroundColor: constants.colorQuarternary,
                height: 50,
                width: 50,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: constants.padding,
              }}
            >
              <Entypo name="plus" size={24} color={constants.colorSecondary} />
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frequences_container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: constants.padding,
    marginBottom: constants.margin * 10,
  },
});
