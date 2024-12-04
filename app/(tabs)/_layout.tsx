import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View } from "react-native";
import constants from "../constants";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => (
          <View
            style={{
              padding: constants.padding,
            }}
          >
            <Ionicons name="menu" size={24} color="black" />
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
