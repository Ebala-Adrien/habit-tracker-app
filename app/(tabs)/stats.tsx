import { View, Text, ScrollView } from "react-native";
import constants from "../../constants";
import { useHabitContext } from "../../contexts/HabitContext";
import { StyleSheet } from "react-native";
import { useTaskContext } from "@/contexts/TaskContext";

export default function StatsScreen() {
  const { habitsCompletionsCount, habitsTimesToBeDone } = useHabitContext();
  const { tasksStats } = useTaskContext();

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
      }}
    >
      <View style={styles.page_title_container}>
        <Text style={styles.page_title}>Stats</Text>
      </View>

      {/* Tasks */}
      <Text style={styles.section_title}>Habits</Text>

      <View style={styles.section_stats_container}>
        <View style={styles.section_stats_sub_container}>
          <Text style={styles.section_stat_number}>
            {habitsCompletionsCount}
          </Text>
          <Text style={styles.section_stat_name}>Habits completed</Text>
        </View>

        <View style={styles.section_stats_sub_container}>
          <Text style={styles.section_stat_number}>
            {habitsTimesToBeDone === 0
              ? "-"
              : ((habitsCompletionsCount / habitsTimesToBeDone) * 100).toFixed(
                  2
                )}
          </Text>
          <Text style={styles.section_stat_name}>% completed</Text>
        </View>
      </View>

      {/* Tasks */}
      <Text style={styles.section_title}>Tasks</Text>

      <View style={styles.section_stats_container}>
        <View style={styles.section_stats_sub_container}>
          <Text style={styles.section_stat_number}>
            {tasksStats.tasksCompleted}
          </Text>
          <Text style={styles.section_stat_name}>Tasks completed</Text>
        </View>

        <View style={styles.section_stats_sub_container}>
          <Text style={styles.section_stat_number}>
            {tasksStats.tasksCompletedOnTime === 0
              ? 0
              : !tasksStats.tasksCompletedOnTime
              ? "-"
              : tasksStats.tasksCompletedOnTime}
          </Text>
          <Text style={styles.section_stat_name}>% completed on time</Text>
        </View>

        <View style={styles.section_stats_sub_container}>
          <Text style={styles.section_stat_number}>
            {tasksStats.overdueTasks}
          </Text>
          <Text style={styles.section_stat_name}>Overdue tasks</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page_title_container: {
    paddingBottom: constants.padding * 2,
  },
  page_title: {
    margin: constants.padding,
    fontWeight: constants.fontWeight,
    fontSize: constants.largeFontSize,
  },
  section_title: {
    fontSize: constants.mediumFontSize,
    fontWeight: constants.fontWeight,
    width: "100%",
    textAlign: "center",
  },
  section_stats_container: {
    margin: constants.padding,
    marginBottom: constants.padding * 4,
    padding: constants.padding,
    backgroundColor: constants.colorSecondary,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    rowGap: constants.padding * 2,
    columnGap: constants.padding * 2,
  },
  section_stat_number: {
    fontWeight: constants.fontWeight,
    fontSize: constants.mediumFontSize,
  },
  section_stat_name: {
    fontSize: constants.smallFontSize,
    fontWeight: constants.fontWeight,
  },
  section_stats_sub_container: {
    display: "flex",
    alignItems: "center",
  },
});
