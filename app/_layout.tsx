import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import { View, SafeAreaView } from 'react-native';
import constants from '../constants';
import HabitContextProvider from '../contexts/HabitContext';
import Toast from 'react-native-toast-message';
import ToastConfig from '../data/ToastConfig';
import AuthContextProvider from '../contexts/AuthContext';
import MenuContextProvider from '@/contexts/MenuContext';
import TaskContextProvider from '@/contexts/TaskContext';
import Header from '@/components/utility/Header';

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
                      <Header
                        title="Create Habit"
                        onBackPress={() => router.push('/(tabs)')}
                      />
                    ),
                  }}
                />
                <Stack.Screen
                  name="create-task"
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
                    header: () => <Header simple />,
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
