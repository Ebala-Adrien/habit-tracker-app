import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native';
import Header from '@/components/utility/Header';
import AppProviders from '@/contexts/AppProviders';

export default function RootLayout() {
  const router = useRouter();

  return (
    <AppProviders>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="CreateHabit"
            options={{
              header: () => (
                <Header
                  title="Create Habit"
                  onBackPress={() => router.push('/(tabs)')}
                />
              ),
            }}
          />
          <Stack.Screen
            name="CreateTask"
            options={{
              header: () => (
                <Header
                  title="Create Task"
                  onBackPress={() => router.push('/(tabs)')}
                />
              ),
            }}
          />
          <Stack.Screen
            name="UpdateHabit"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="UpdateTask"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Habit"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Task"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ForgotPassword"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Register"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Settings"
            options={{
              header: () => <Header simple />,
            }}
          />
        </Stack>
      </SafeAreaView>
    </AppProviders>
  );
}
