import { View, Text, ScrollView, Dimensions } from "react-native";
import constants from "../../constants";
import { useHabitContext } from "../../contexts/HabitContext";
import { StyleSheet } from "react-native";
import { useTaskContext } from "@/contexts/TaskContext";

// Placeholder data (replace with actual data fetching)
const habitStats = {
  leastFollowed: {
    name: "Evening Exercise",
    completionRate: 25,
    daysMissed: 15,
  },
  needsImprovement: [
    {
      name: "Morning Meditation",
      completionRate: 35,
    },
    {
      name: "Reading",
      completionRate: 40,
    },
  ],
};

const taskStats = {
  oldestTask: {
    name: "Review Project Proposal",
    createdDays: 30,
  },
  mostOverdue: {
    name: "Update Documentation",
    overdueDays: 15,
    dueDate: "2024-02-15",
  },
};

const { width } = Dimensions.get("window");
const cardWidth = width - constants.padding * 4;

export default function StatsScreen() {
  const { habitsCompletionsCount, habitsTimesToBeDone } = useHabitContext();
  const { tasksStats } = useTaskContext();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.page_title}>Statistics</Text>
        <Text style={styles.subtitle}>Track your progress</Text>
      </View>

      {/* Habits Section */}
      <View style={styles.section}>
        <Text style={styles.section_title}>Habits Overview</Text>

        <View style={styles.overview_card}>
          <View style={styles.stat_circle}>
            <Text style={styles.circle_number}>
              {habitsTimesToBeDone === 0
                ? "-"
                : (
                    (habitsCompletionsCount / habitsTimesToBeDone) *
                    100
                  ).toFixed(0)}
            </Text>
            <Text style={styles.circle_label}>%</Text>
          </View>
          <Text style={styles.stat_description}>Completion Rate</Text>
          <Text style={styles.total_completed}>
            {habitsCompletionsCount} habits completed
          </Text>
        </View>

        {/* Least Followed Habit */}
        <View style={styles.card}>
          <View style={styles.card_header}>
            <Text style={styles.card_title}>Needs Most Attention</Text>
          </View>
          <View style={styles.card_content}>
            <Text style={styles.highlight_text}>
              {habitStats.leastFollowed.name}
            </Text>
            <View style={styles.metrics_row}>
              <View style={styles.metric}>
                <Text style={styles.metric_value}>
                  {habitStats.leastFollowed.completionRate}%
                </Text>
                <Text style={styles.metric_label}>Success Rate</Text>
              </View>
              <View style={styles.metric_divider} />
              <View style={styles.metric}>
                <Text style={styles.metric_value}>
                  {habitStats.leastFollowed.daysMissed}
                </Text>
                <Text style={styles.metric_label}>Days Missed</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Habits Needing Improvement */}
        <View style={styles.card}>
          <View style={styles.card_header}>
            <Text style={styles.card_title}>Improvement Areas</Text>
          </View>
          {habitStats.needsImprovement.map((habit, index) => (
            <View
              key={index}
              style={[
                styles.improvement_item,
                index < habitStats.needsImprovement.length - 1 &&
                  styles.with_border,
              ]}
            >
              <Text style={styles.habit_name}>{habit.name}</Text>
              <View style={styles.progress_container}>
                <View
                  style={[
                    styles.progress_bar,
                    { width: `${habit.completionRate}%` },
                  ]}
                />
                <Text style={styles.progress_text}>
                  {habit.completionRate}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Tasks Section */}
      <View style={styles.section}>
        <Text style={styles.section_title}>Tasks Overview</Text>

        <View style={styles.overview_card}>
          <View style={styles.metrics_row}>
            <View style={styles.metric}>
              <Text style={styles.big_number}>{tasksStats.tasksCompleted}</Text>
              <Text style={styles.metric_label}>Completed</Text>
            </View>
            <View style={styles.metric_divider} />
            <View style={styles.metric}>
              <Text style={styles.big_number}>{tasksStats.overdueTasks}</Text>
              <Text style={styles.metric_label}>Overdue</Text>
            </View>
          </View>
        </View>

        {/* Task Insights */}
        <View style={styles.card}>
          <View style={styles.card_header}>
            <Text style={styles.card_title}>Task Insights</Text>
          </View>
          <View style={styles.insight_item}>
            <Text style={styles.insight_label}>Oldest Pending</Text>
            <Text style={styles.insight_value}>
              {taskStats.oldestTask.name}
            </Text>
            <Text style={styles.insight_detail}>
              Created {taskStats.oldestTask.createdDays} days ago
            </Text>
          </View>
          <View style={styles.metric_divider} />
          <View style={styles.insight_item}>
            <Text style={styles.insight_label}>Most Overdue</Text>
            <Text style={styles.insight_value}>
              {taskStats.mostOverdue.name}
            </Text>
            <Text style={styles.insight_detail}>
              {taskStats.mostOverdue.overdueDays} days overdue
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingHorizontal: constants.padding * 2,
    paddingTop: constants.padding * 3,
    paddingBottom: constants.padding * 2,
  },
  page_title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
  },
  section: {
    marginBottom: constants.padding * 3,
  },
  section_title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
    marginHorizontal: constants.padding * 2,
    marginBottom: constants.padding * 1.5,
  },
  overview_card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: constants.padding * 2,
    marginHorizontal: constants.padding * 2,
    marginBottom: constants.padding * 2,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  stat_circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: constants.colorPrimary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: constants.padding,
  },
  circle_number: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  circle_label: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  stat_description: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  total_completed: {
    fontSize: 14,
    color: "#666666",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: constants.padding * 2,
    marginBottom: constants.padding * 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  card_header: {
    padding: constants.padding * 1.5,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  card_title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  card_content: {
    padding: constants.padding * 1.5,
  },
  highlight_text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: constants.padding,
  },
  metrics_row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  metric: {
    flex: 1,
    alignItems: "center",
  },
  metric_divider: {
    width: 1,
    height: 40,
    backgroundColor: "#F0F0F0",
  },
  metric_value: {
    fontSize: 24,
    fontWeight: "700",
    color: constants.colorPrimary,
    marginBottom: 4,
  },
  metric_label: {
    fontSize: 14,
    color: "#666666",
  },
  improvement_item: {
    padding: constants.padding * 1.5,
  },
  with_border: {
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  habit_name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  progress_container: {
    height: 24,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  progress_bar: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    backgroundColor: constants.colorPrimary,
    borderRadius: 12,
  },
  progress_text: {
    position: "absolute",
    right: 8,
    top: 2,
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  big_number: {
    fontSize: 36,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  insight_item: {
    padding: constants.padding * 1.5,
  },
  insight_label: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  insight_value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  insight_detail: {
    fontSize: 14,
    color: constants.colorPrimary,
  },
});
