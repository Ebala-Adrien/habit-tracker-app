import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, View, SafeAreaView } from "react-native";
import constants from "../../constants";
import { useRouter } from "expo-router";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useMenuContext } from "@/contexts/MenuContext";
import SimpleHeader from "@/components/utility/SimpleHeader";

export default function TabLayout() {
  const router = useRouter();
  const { setShowFilter, showFilter } = useMenuContext();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: constants.colorPrimary }}>
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
              <Pressable onPress={() => router.push("/settings")}>
                <SimpleLineIcons name="menu" size={30} color="black" />
              </Pressable>

              <Pressable onPress={() => setShowFilter(!showFilter)}>
                <Ionicons
                  name="filter-sharp"
                  size={30}
                  color={constants.colorTertiary}
                />
              </Pressable>
            </View>
          ),
          tabBarActiveTintColor: constants.colorQuarternary,
          tabBarStyle: {
            borderWidth: 0,
          },
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
            header: () => <SimpleHeader />,
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
    </SafeAreaView>
  );
}
