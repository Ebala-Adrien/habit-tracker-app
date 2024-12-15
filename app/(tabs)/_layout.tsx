import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, View } from "react-native";
import constants from "../constants";
import { useRouter } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

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
              padding: constants.padding,
            }}
          >
            <Pressable>
              <SimpleLineIcons name="menu" size={30} color="black" />
            </Pressable>

            <Pressable onPress={() => router.push("/create-habit")}>
              <FontAwesome6
                name="square-plus"
                size={30}
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
