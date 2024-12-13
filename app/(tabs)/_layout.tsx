import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import EntypoIcons from "@expo/vector-icons/Entypo";
import { Pressable, View } from "react-native";
import constants from "../constants";
import { useRouter } from "expo-router";

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        header: () => (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Pressable>
              <Ionicons name="menu" size={24} color={constants.colorTertiary} />
            </Pressable>

            <Pressable onPress={() => router.push("/create-habit")}>
              <EntypoIcons
                name="plus"
                size={24}
                color={constants.colorTertiary}
              />
            </Pressable>
          </View>
        ),
        tabBarActiveTintColor: constants.colorQuarternary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={constants.colorQuarternary}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "stats-chart" : "stats-chart-outline"}
              color={constants.colorQuarternary}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
