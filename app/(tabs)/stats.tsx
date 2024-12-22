import { View, Text, ScrollView } from "react-native";
import constants from "../constants";
import { useHabitContext } from "../contexts/HabitContext";

export default function StatsScreen() {
  const { habitsCompletionsCount, habitsTimesToBeDone } = useHabitContext();

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
      }}
    >
      <View
        style={{
          paddingBottom: constants.padding * 2,
        }}
      >
        <Text
          style={{
            margin: constants.padding,
            fontWeight: constants.fontWeight,
            fontSize: constants.largeFontSize,
          }}
        >
          Stats
        </Text>
      </View>

      <View
        style={{
          margin: constants.padding,
          padding: constants.padding,
          backgroundColor: constants.colorSecondary,
          borderRadius: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontWeight: constants.fontWeight,
              fontSize: constants.mediumFontSize,
            }}
          >
            {habitsCompletionsCount}
          </Text>
          <Text
            style={{
              fontSize: constants.smallFontSize,
              fontWeight: constants.fontWeight,
            }}
          >
            Habits completed
          </Text>
        </View>

        <View
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontWeight: constants.fontWeight,
              fontSize: constants.mediumFontSize,
            }}
          >
            {habitsTimesToBeDone === 0
              ? "-"
              : ((habitsCompletionsCount / habitsTimesToBeDone) * 100).toFixed(
                  2
                )}
          </Text>
          <Text
            style={{
              fontSize: constants.smallFontSize,
              fontWeight: constants.fontWeight,
            }}
          >
            % completed
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
