import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import constants from "../../constants";
import React, { useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import LoadingComponent from "../../components/utility/Loading";
import Entypo from "@expo/vector-icons/Entypo";
import { useMenuContext } from "@/contexts/MenuContext";
import HabitAndTaskList from "@/components/habitOrTask/display/HabitAndTaskList";
import { displayFrequencies } from "@/data";
import HabitAndTaskFilter from "@/components/habitOrTask/modal/HabitAndTaskFilter";

export default function HomeScreen() {
  const {
    showFilter,
    setShowCreateTaskOrHabitModal,
    homeScreenDisplayFrequence,
    setHomeScreenDisplayFrequence,
  } = useMenuContext();
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
        position: "relative",
      }}
    >
      {authCtxIsLoading ? (
        <LoadingComponent size={80} color={constants.colorQuarternary} />
      ) : (
        <>
          {showFilter && <HabitAndTaskFilter />}

          <View style={styles.frequences_container}>
            {displayFrequencies.map((r) => {
              const isCurrentFrequence = homeScreenDisplayFrequence === r;

              return (
                <Pressable
                  key={r}
                  onPress={() => setHomeScreenDisplayFrequence(r)}
                >
                  <Text
                    style={{
                      fontWeight: "500",
                      fontSize: constants.mediumFontSize,
                      color: isCurrentFrequence
                        ? constants.colorTertiary
                        : constants.colorSextary,
                      backgroundColor: isCurrentFrequence
                        ? constants.colorSecondary
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

          <View style={{ flex: 1 }}>
            <ScrollView
              style={{
                paddingHorizontal: constants.padding * 2,
                flex: 1,
              }}
              contentContainerStyle={{
                paddingBottom: 70,
              }}
            >
              <HabitAndTaskList />
            </ScrollView>

            <View
              style={{
                position: "absolute",
                bottom: 20,
                right: constants.padding,
                height: 50,
                width: 50,
                zIndex: 1,
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
                <Entypo
                  name="plus"
                  size={24}
                  color={constants.colorSecondary}
                />
              </Pressable>
            </View>
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
