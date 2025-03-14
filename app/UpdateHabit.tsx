import { useLocalSearchParams } from "expo-router";
import EditHabit from "../components/habit/create/EditHabit";
import { Pressable, View, Text } from "react-native";
import constants from "../constants";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";

export default function UpdateHabit() {
  const { id } = useLocalSearchParams() as { id: string };
  const router = useRouter();

  return (
    <>
      <View
        style={{
          backgroundColor: constants.colorSecondary,
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        {/* Back Button */}
        <Pressable
          style={{ padding: constants.padding }}
          onPress={() => router.push("/(tabs)")}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={constants.colorTertiary}
          />
        </Pressable>

        {/* Title */}
        <Text
          style={{
            fontSize: constants.largeFontSize,
            fontWeight: constants.fontWeight,
            padding: constants.padding,
          }}
        >
          Update Habit
        </Text>
      </View>
      <EditHabit id={id} />
    </>
  );
}
