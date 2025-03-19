import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native";
import constants from "@/constants";
import { useRouter } from "expo-router";
import { useMenuContext } from "@/contexts/MenuContext";
import { getTabScreenOptions, tabScreens } from "../navigation/tabConfig";

export default function TabLayout() {
  const router = useRouter();
  const { setShowFilter, showFilter } = useMenuContext();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: constants.colorPrimary }}>
      <Tabs
        screenOptions={{
          ...getTabScreenOptions({
            router,
            setShowFilter,
            showFilter,
          }),
          tabBarShowLabel: false,
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
      </Tabs>
    </SafeAreaView>
  );
}
