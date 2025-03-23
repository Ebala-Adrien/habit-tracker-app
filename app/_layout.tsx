import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import Header from "@/components/utility/Header";
import AppProviders from "@/contexts/AppProviders";

export default function RootLayout() {
  const router = useRouter();

  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="createHabit"
          options={{
            headerShown: true,
            header: () => (
              <Header
                title="Create Habit"
                onBackPress={() => router.push("/(tabs)")}
              />
            ),
          }}
        />
        <Stack.Screen
          name="createTask"
          options={{
            headerShown: true,
            header: () => (
              <Header
                title="Create Task"
                onBackPress={() => router.push("/(tabs)")}
              />
            ),
          }}
        />
        <Stack.Screen name="UpdateHabit" />
        <Stack.Screen name="UpdateTask" />
        <Stack.Screen name="Habit" />
        <Stack.Screen name="Task" />
        <Stack.Screen name="Test" />
        <Stack.Screen name="Login" />
        <Stack.Screen name="ForgotPassword" />
        <Stack.Screen name="Register" />
        <Stack.Screen name="Settings" />
      </Stack>
    </AppProviders>
  );
}
