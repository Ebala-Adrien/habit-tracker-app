import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native";
import constants from "@/constants";
import { getTabScreenOptions, tabScreens } from "../navigation/tabConfig";

export default function TabLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: constants.colorPrimary }}>
      <Tabs
        screenOptions={{
          ...getTabScreenOptions(),
          tabBarShowLabel: false,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name={tabScreens.home.name}
          options={tabScreens.home.options}
        />
        <Tabs.Screen
          name={tabScreens.stats.name}
          options={tabScreens.stats.options}
        />
        <Tabs.Screen
          name={tabScreens.settings.name}
          options={tabScreens.settings.options}
        />
      </Tabs>
    </SafeAreaView>
  );
}
