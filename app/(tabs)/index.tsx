import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
} from "react-native";
import constants from "../../constants";
import React, { useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import LoadingComponent from "../../components/utility/Loading";
import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useMenuContext } from "@/contexts/MenuContext";
import { displayFrequencies } from "@/data";
import HabitAndTaskFilter from "@/components/habitOrTask/modal/HabitAndTaskFilter";
import {
  HabitList,
  TaskList,
} from "@/components/habitOrTask/display/HabitAndTaskList";
// Placeholder data
const placeholderData = {
  habits: [
    {
      id: "1",
      name: "Morning Meditation",
      streak: 5,
      completed: true,
      type: "habit" as const,
      time: "8:00 AM",
    },
    {
      id: "2",
      name: "Read 30 minutes",
      streak: 3,
      completed: false,
      type: "habit" as const,
      time: "9:00 AM",
    },
  ],
  tasks: [
    {
      id: "3",
      name: "Project Review",
      priority: "high" as const,
      completed: false,
      type: "task" as const,
      dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    },
    {
      id: "4",
      name: "Team Meeting",
      priority: "medium" as const,
      completed: true,
      type: "task" as const,
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
    },
    {
      id: "5",
      name: "Past Due Task",
      priority: "high" as const,
      completed: false,
      type: "task" as const,
      dueDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    },
    {
      id: "6",
      name: "Task due in 2 days",
      priority: "high" as const,
      completed: false,
      type: "task" as const,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from ago
    },
  ],
};

interface ListItem {
  id: string;
  name: string;
  streak?: number;
  completed: boolean;
  type: "habit" | "task";
  time?: string;
  dueDate?: string;
  priority?: "high" | "medium" | "low";
}

const ListItem = ({ item }: { item: ListItem }) => {
  const isHabit = item.type === "habit";

  const getDueColor = (dueDate: string) => {
    const now = new Date();
    const dueDateObj = new Date(dueDate);
    const diffHours = (dueDateObj.getTime() - now.getTime()) / (1000 * 60 * 60);
    const diffDays = diffHours / 24;

    if (diffHours <= 0 || diffHours <= 24) {
      return constants.colorError;
    } else if (diffDays <= 3) {
      return constants.colorWarning;
    } else {
      return constants.colorSuccess;
    }
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View style={styles.listItem}>
      <Pressable
        style={[
          styles.checkbox,
          item.completed && styles.checkboxChecked,
          isHabit && styles.habitCheckbox,
        ]}
      >
        {item.completed && (
          <MaterialCommunityIcons
            name="check"
            size={16}
            color={constants.colorSecondary}
          />
        )}
      </Pressable>

      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text
            style={[
              styles.itemTitle,
              item.completed && styles.itemTitleCompleted,
            ]}
          >
            {item.name}
          </Text>
          {isHabit && (
            <View
              style={[
                styles.streakBadge,
                {
                  backgroundColor: `${
                    item.streak === 0
                      ? constants.colorWarning
                      : item.streak && item.streak < 5
                      ? constants.colorWarning
                      : constants.colorSuccess
                  }15`,
                },
              ]}
            >
              <MaterialCommunityIcons
                name="fire"
                size={12}
                color={
                  item.streak === 0
                    ? constants.colorWarning
                    : item.streak && item.streak < 5
                    ? constants.colorWarning
                    : constants.colorSuccess
                }
              />
              <Text
                style={[
                  styles.streakText,
                  {
                    color:
                      item.streak === 0
                        ? constants.colorWarning
                        : item.streak && item.streak < 5
                        ? constants.colorWarning
                        : constants.colorSuccess,
                  },
                ]}
              >
                {item.streak || 0}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.itemSubtext}>
          {isHabit
            ? item.time
            : item.dueDate
            ? formatDueDate(item.dueDate)
            : ""}
        </Text>
      </View>

      {!isHabit && item.dueDate && (
        <View
          style={[
            styles.priorityIndicator,
            { backgroundColor: getDueColor(item.dueDate) },
          ]}
        />
      )}
    </View>
  );
};

export default function HomeScreen() {
  const {
    showFilter,
    setShowCreateTaskOrHabitModal,
    homeScreenDisplayFrequence,
    setHomeScreenDisplayFrequence,
  } = useMenuContext();
  const { authCtxIsLoading } = useAuthContext();
  const { deleteHabitMsg } = useLocalSearchParams();

  useEffect(() => {
    if (deleteHabitMsg) {
      Toast.show({
        text1: deleteHabitMsg.toString(),
        position: "bottom",
        bottomOffset: 60,
        type: "deletedHabitToast",
      });
    }
  }, [deleteHabitMsg]);

  return (
    <SafeAreaView style={styles.container}>
      {authCtxIsLoading ? (
        <LoadingComponent size={80} color={constants.colorQuarternary} />
      ) : (
        <>
          {showFilter && <HabitAndTaskFilter />}

          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Day</Text>
            <Text style={styles.headerDate}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>

          {/* Frequency Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.frequencyScrollView}
            contentContainerStyle={styles.frequencyContainer}
          >
            {displayFrequencies.map((frequency) => {
              const isSelected = homeScreenDisplayFrequence === frequency;
              return (
                <Pressable
                  key={frequency}
                  onPress={() => setHomeScreenDisplayFrequence(frequency)}
                  style={[
                    styles.frequencyButton,
                    isSelected && styles.frequencyButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.frequencyText,
                      isSelected && styles.frequencyTextSelected,
                    ]}
                  >
                    {frequency}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Habits Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Habits</Text>
                <HabitList />
              </View>

              {/* Tasks Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tasks</Text>
                <TaskList />
              </View>
            </ScrollView>

            {/* Floating Action Button */}
            <Pressable
              onPress={() => setShowCreateTaskOrHabitModal(true)}
              style={({ pressed }) => [
                styles.fab,
                pressed && styles.fabPressed,
              ]}
            >
              <Entypo name="plus" size={24} color="#FFFFFF" />
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: constants.colorBackground,
  },
  header: {
    paddingHorizontal: constants.padding * 2,
    paddingTop: constants.padding * 2,
    paddingBottom: constants.padding,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: constants.colorTertiary,
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 16,
    color: constants.colorSextary,
  },
  frequencyScrollView: {
    maxHeight: 60,
  },
  frequencyContainer: {
    paddingHorizontal: constants.padding * 2,
    gap: constants.padding,
    paddingVertical: constants.padding,
  },
  frequencyButton: {
    paddingHorizontal: constants.padding * 2,
    paddingVertical: constants.padding,
    borderRadius: 25,
    backgroundColor: constants.colorQuinary,
  },
  frequencyButtonSelected: {
    backgroundColor: constants.colorPrimary,
  },
  frequencyText: {
    fontSize: 15,
    fontWeight: "500",
    color: constants.colorSextary,
  },
  frequencyTextSelected: {
    color: constants.colorSecondary,
  },
  mainContent: {
    flex: 1,
    position: "relative",
  },
  scrollContent: {
    paddingHorizontal: constants.padding * 2,
    paddingBottom: 100,
  },
  section: {
    marginBottom: constants.padding * 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: constants.colorSextary,
    marginBottom: constants.padding,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: constants.padding,
    backgroundColor: constants.colorSecondary,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: constants.colorTertiary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: constants.colorPrimary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: constants.colorPrimary,
  },
  habitCheckbox: {
    borderRadius: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: constants.colorTertiary,
    flex: 1,
  },
  itemTitleCompleted: {
    color: constants.colorMuted,
    textDecorationLine: "line-through",
  },
  itemSubtext: {
    fontSize: 13,
    color: constants.colorSextary,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  streakText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "500",
  },
  priorityIndicator: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginLeft: 12,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: constants.padding * 2,
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: constants.colorPrimary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: constants.colorTertiary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
