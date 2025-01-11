import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { View, SafeAreaView, Text, Pressable } from "react-native";
import constants from "../constants";
import HabitContextProvider from "../contexts/HabitContext";
import Toast from "react-native-toast-message";
import ToastConfig from "../data/ToastConfig";
import AuthContextProvider from "../contexts/AuthContext";
import MenuContextProvider from "@/contexts/MenuContext";
import TaskContextProvider from "@/contexts/TaskContext";
import SimpleHeader from "@/components/utility/SimpleHeader";

export default function RootLayout() {
  const router = useRouter();

  return (
    <AuthContextProvider>
      <MenuContextProvider>
        <HabitContextProvider>
          <TaskContextProvider>
            <SafeAreaView style={{ flex: 1 }}>
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
                          marginBottom: constants.margin * 10,
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
                  name="create-task"
                  options={{
                    header: () => (
                      <View
                        style={{
                          backgroundColor: constants.colorSecondary,
                          flexDirection: "column",
                          alignItems: "flex-start",
                          justifyContent: "flex-start",
                          marginBottom: constants.margin * 10,
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
                          Create Task
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
                  name="update-task"
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
                <Stack.Screen
                  name="task"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="login"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="forgot-password"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="register"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="settings"
                  options={{
                    header: () => <SimpleHeader />,
                  }}
                />
              </Stack>
              <Toast config={ToastConfig} />
            </SafeAreaView>
          </TaskContextProvider>
        </HabitContextProvider>
      </MenuContextProvider>
    </AuthContextProvider>
  );
}
