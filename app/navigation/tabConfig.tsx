import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Pressable } from "react-native";
import constants from "@/constants";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Header from "@/components/utility/Header";
import { tabHeaderStyles } from "@/styles/tabHeader";

interface TabHeaderProps {
  router: any;
  setShowFilter: (show: boolean) => void;
  showFilter: boolean;
}

export const TabHeader = ({
  router,
  setShowFilter,
  showFilter,
}: TabHeaderProps) => (
  <View style={tabHeaderStyles.container}>
    <Pressable onPress={() => router.push("/settings")}>
      <SimpleLineIcons name="menu" size={30} color="black" />
    </Pressable>

    <Pressable onPress={() => setShowFilter(!showFilter)}>
      <Ionicons name="filter-sharp" size={30} color={constants.colorTertiary} />
    </Pressable>
  </View>
);

export const getTabScreenOptions = ({
  router,
  setShowFilter,
  showFilter,
}: TabHeaderProps) => ({
  header: () => (
    <TabHeader
      router={router}
      setShowFilter={setShowFilter}
      showFilter={showFilter}
    />
  ),
  tabBarActiveTintColor: constants.colorQuarternary,
  tabBarStyle: {
    borderWidth: 0,
    height: 70,
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export const tabScreens = {
  home: {
    name: "index" as const,
    options: {
      title: "Home",
      tabBarIcon: ({ focused }: { focused: boolean }) => (
        <Ionicons
          name={"home"}
          color={focused ? constants.colorQuarternary : constants.colorSextary}
          size={24}
        />
      ),
    },
  },
  stats: {
    name: "stats" as const,
    options: {
      header: () => <Header simple />,
      title: "Stats",
      tabBarIcon: ({ focused }: { focused: boolean }) => (
        <Ionicons
          name={"stats-chart"}
          color={focused ? constants.colorQuarternary : constants.colorSextary}
          size={24}
        />
      ),
    },
  },
};
