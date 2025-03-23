import { useHabitContext } from "@/contexts/HabitContext";
import { useTaskContext } from "@/contexts/TaskContext";
import { DateType, Day, Task } from "@/types";
import {
  getMonthStartAndEnd,
  getWeekStartAndEnd,
  compareDates,
} from "@/utility";
import {
  shouldHabitBeDoneThisMonth,
  shouldHabitBeDoneThisWeek,
  shouldHabitBeDoneToday,
} from "@/utility/habit/habitList";
import React, { useMemo } from "react";
import { Pressable, Text, View, GestureResponderEvent } from "react-native";
import constants from "@/constants";
import { useRouter } from "expo-router";
import { useMenuContext } from "@/contexts/MenuContext";
import { Habit } from "@/types";
import { StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { calculateStreak } from "@/utility/habit";

const HabitListItem = ({ item }: { item: Habit }) => {
  const { updateHabitCompletions } = useHabitContext();
  const router = useRouter();

  const itemCompleted = item.habitCompletions.some((c) =>
    compareDates(new Date(c), new Date())
  );

  const itemStreak = calculateStreak(item);

  const handleCompletion = async (e: GestureResponderEvent) => {
    e.stopPropagation();
    const updatedHabit = {
      ...item,
      habitCompletions: itemCompleted
        ? [...item.habitCompletions].filter(
            (c) => !compareDates(new Date(c), new Date())
          )
        : [...item.habitCompletions, new Date().toUTCString()].sort(
            (d1, d2) => new Date(d1).valueOf() - new Date(d2).valueOf()
          ),
    };

    await updateHabitCompletions(updatedHabit);
  };

  return (
    <Pressable
      style={styles.listItem}
      onPress={() => router.push(`/habit?id=${item.id}`)}
    >
      <Pressable
        style={[
          styles.checkbox,
          styles.habitCheckbox,
          itemCompleted && styles.checkboxChecked,
        ]}
        onPress={handleCompletion}
      >
        {itemCompleted && (
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
              itemCompleted && styles.itemTitleCompleted,
            ]}
          >
            {item.title}
          </Text>

          <View
            style={[
              styles.streakBadge,
              {
                backgroundColor: `${
                  itemStreak === 0
                    ? constants.colorError
                    : itemStreak && itemStreak < 5
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
                itemStreak === 0
                  ? constants.colorError
                  : itemStreak && itemStreak < 5
                  ? constants.colorWarning
                  : constants.colorSuccess
              }
            />
            <Text
              style={[
                styles.streakText,
                {
                  color:
                    itemStreak === 0
                      ? constants.colorError
                      : itemStreak && itemStreak < 5
                      ? constants.colorWarning
                      : constants.colorSuccess,
                },
              ]}
            >
              {itemStreak || 0}
            </Text>
          </View>
        </View>

        <Text style={styles.itemSubtext}>
          {item.frequency.type.toLowerCase()} habit
        </Text>
      </View>
    </Pressable>
  );
};

export function HabitList() {
  const { habits } = useHabitContext();
  const { homeScreenDisplayFrequence: frequence } = useMenuContext();
  const router = useRouter();

  const {
    startCurrentWeek,
    endCurrentWeek,
    startCurrentMonth,
    endCurrentMonth,
    nbOfDaysInCurrentMonth,
    currentDate,
    currentDay,
  } = useMemo(() => {
    const today = new Date();
    const { startOfWeek, endOfWeek } = getWeekStartAndEnd(today);
    const { startOfMonth, endOfMonth } = getMonthStartAndEnd(today);
    const nbOfDaysInCurrentMonth: number = Number(
      new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
    );
    const currentDay = today.getDay() as Day;
    const currentDate = today.getDate() as DateType;

    return {
      startCurrentWeek: startOfWeek,
      endCurrentWeek: endOfWeek,
      startCurrentMonth: startOfMonth,
      endCurrentMonth: endOfMonth,
      nbOfDaysInCurrentMonth: nbOfDaysInCurrentMonth,
      currentDate,
      currentDay,
    };
  }, []);

  const habitList = useMemo(() => {
    if (frequence === "Overall") {
      return habits;
    } else if (frequence === "Day") {
      return habits.filter((h: Habit) => {
        const status = shouldHabitBeDoneToday(
          h,
          startCurrentWeek,
          endCurrentWeek,
          startCurrentMonth,
          endCurrentMonth,
          currentDay,
          currentDate
        );
        return status.shouldBeDone || status.recentlyCompleted;
      });
    } else if (frequence === "Week") {
      return habits.filter((h: Habit) => {
        const status = shouldHabitBeDoneThisWeek(
          h,
          startCurrentWeek,
          endCurrentWeek,
          startCurrentMonth,
          endCurrentMonth,
          currentDay,
          nbOfDaysInCurrentMonth
        );
        return status.shouldBeDone || status.recentlyCompleted;
      });
    } else {
      return habits.filter((h: Habit) => {
        const status = shouldHabitBeDoneThisMonth(
          h,
          startCurrentWeek,
          endCurrentWeek,
          startCurrentMonth,
          endCurrentMonth,
          currentDate
        );
        return status.shouldBeDone || status.recentlyCompleted;
      });
    }
  }, [habits, frequence]);

  if (habitList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="calendar-plus"
          size={48}
          color={constants.colorQuinary}
        />
        <Text style={styles.emptyText}>No habits yet</Text>
        <Pressable
          style={styles.createButton}
          onPress={() => router.push("/createHabit")}
        >
          <Text style={styles.createButtonText}>Create your first habit</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      {habitList.map((habit) => (
        <HabitListItem key={habit.id} item={habit} />
      ))}
    </>
  );
}

export function TaskListItem({ item }: { item: Task }) {
  const { toggleTaskCompletion } = useTaskContext();
  const router = useRouter();

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

  const handleToggleCompletion = async (e: GestureResponderEvent) => {
    e.stopPropagation(); // Prevent triggering the parent Pressable
    try {
      await toggleTaskCompletion(item);
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  return (
    <Pressable
      style={styles.listItem}
      onPress={() => router.push(`/task?id=${item.id}`)}
    >
      <Pressable
        style={[styles.checkbox, item.completed && styles.checkboxChecked]}
        onPress={handleToggleCompletion}
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
            {item.title}
          </Text>
        </View>

        <Text style={styles.itemSubtext}>{formatDueDate(item.dueDate)}</Text>
      </View>

      <View
        style={[
          styles.priorityIndicator,
          { backgroundColor: getDueColor(item.dueDate) },
        ]}
      />
    </Pressable>
  );
}

export function TaskList() {
  const { tasks } = useTaskContext();
  const router = useRouter();

  const taskList = useMemo(() => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Filter tasks to show:
    // 1. All incomplete tasks
    // 2. Tasks completed within the last hour
    return tasks
      .filter((task) => {
        if (!task.completed) return true;
        if (!task.completedAt) return false;
        const completionDate = new Date(task.completedAt);
        return completionDate >= oneHourAgo && completionDate <= now;
      })
      .sort((a, b) => {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
  }, [tasks]);

  if (taskList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="checkbox-marked-outline"
          size={48}
          color={constants.colorQuinary}
        />
        <Text style={styles.emptyText}>No tasks yet</Text>
        <Pressable
          style={styles.createButton}
          onPress={() => router.push("/createTask")}
        >
          <Text style={styles.createButtonText}>Create your first task</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      {taskList.map((task) => (
        <TaskListItem key={task.id} item={task} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
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
    color: constants.colorQuinary,
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
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: constants.padding * 2,
    backgroundColor: constants.colorSecondary,
    borderRadius: 12,
    marginBottom: 8,
    minHeight: 160,
    shadowColor: constants.colorTertiary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: constants.colorQuinary,
    marginTop: constants.padding,
    marginBottom: constants.padding * 1.5,
  },
  createButton: {
    backgroundColor: `${constants.colorPrimary}15`,
    paddingHorizontal: constants.padding * 1.5,
    paddingVertical: constants.padding,
    borderRadius: 20,
  },
  createButtonText: {
    color: constants.colorPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
});
