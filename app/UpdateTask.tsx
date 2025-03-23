import { useLocalSearchParams } from "expo-router";
import { Pressable, View, Text } from "react-native";
import constants from "../constants";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import EditTask from "@/components/task/create/EditTask";

export default function UpdateTask() {
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
          onPress={() => router.back()}
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
          Update Task
        </Text>
      </View>
      <EditTask id={id} />
    </>
  );
}
