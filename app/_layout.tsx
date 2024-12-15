import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";
import constants from "./constants";
import { HabitContextProvider } from "./contexts/HabitContext";
import Toast from "react-native-toast-message";
import { ToastConfig } from "./data/ToastConfig";

export default function RootLayout() {
  const router = useRouter();

  return (
    <HabitContextProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="create-habit"
          options={{
            header: () => (
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
                  Create Habit
                </Text>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="update-habit"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="habit"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <Toast config={ToastConfig} />
    </HabitContextProvider>
  );
}
