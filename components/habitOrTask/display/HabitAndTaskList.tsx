import { useHabitContext } from "@/contexts/HabitContext";
import { useTaskContext } from "@/contexts/TaskContext";
import { DateType, Day, Task } from "@/types";
import { getMonthStartAndEnd, getWeekStartAndEnd } from "@/utility";
import {
  shouldHabitBeDoneThisMonth,
  shouldHabitBeDoneThisWeek,
  shouldHabitBeDoneToday,
} from "@/utility/habitList";
import React, { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import NoHabitOrTask from "./NoHabitOrTask";
import constants from "@/constants";
import { useRouter } from "expo-router";
import { useMenuContext } from "@/contexts/MenuContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Feather from "@expo/vector-icons/Feather";
import { Habit } from "@/types";
import { StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HabitListItem = ({ item }: { item: Habit }) => {
  const itemCompleted: boolean = false; // TODO: get from habit
  const itemStreak: number = Math.floor(Math.random() * 8); // TODO: get from habit

  const router = useRouter();

  return (
    <Pressable
      style={styles.listItem}
      onPress={() => router.push(`/habit?id=${item.id}`)}
    >
      <Pressable
        style={[
          styles.checkbox,
          itemCompleted && styles.checkboxChecked && styles.habitCheckbox,
        ]}
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
      return habits.filter((h: Habit) =>
        shouldHabitBeDoneToday(
          h,
          startCurrentWeek,
          endCurrentWeek,
          startCurrentMonth,
          endCurrentMonth,
          currentDay,
          currentDate
        )
      );
    } else if (frequence === "Week") {
      return habits.filter((h: Habit) =>
        shouldHabitBeDoneThisWeek(
          h,
          startCurrentWeek,
          endCurrentWeek,
          startCurrentMonth,
          endCurrentMonth,
          currentDay,
          nbOfDaysInCurrentMonth
        )
      );
    } else {
      return habits.filter((h: Habit) =>
        shouldHabitBeDoneThisMonth(
          h,
          startCurrentWeek,
          endCurrentWeek,
          startCurrentMonth,
          endCurrentMonth,
          currentDate
        )
      );
    }
  }, [habits, frequence]);

  return (
    <>
      {habitList.map((habit) => (
        <HabitListItem key={habit.id} item={habit} />
      ))}
    </>
  );
}

export function TaskListItem({ item }: { item: Task }) {
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

  const router = useRouter();

  return (
    <Pressable
      style={styles.listItem}
      onPress={() => router.push(`/task?id=${item.id}`)}
    >
      <Pressable
        style={[styles.checkbox, item.completed && styles.checkboxChecked]}
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

  const taskList = useMemo(() => {
    return tasks;
  }, [tasks]);

  return (
    <>
      {taskList.map((task) => (
        <TaskListItem key={task.id} item={task} />
      ))}
    </>
  );
}

export default function HabitAndTaskList() {
  const { habits } = useHabitContext();
  const { tasks } = useTaskContext();
  const { homeScreenDisplayFrequence: frequence, filter } = useMenuContext();

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
    if (!filter[0].checked) return [];
    if (frequence === "Overall") {
      return habits;
    } else if (frequence === "Day") {
      return habits.filter((h: Habit) =>
        shouldHabitBeDoneToday(
          h,
          startCurrentWeek,
          endCurrentWeek,
          startCurrentMonth,
          endCurrentMonth,
          currentDay,
          currentDate
        )
      );
    } else if (frequence === "Week") {
      return habits.filter((h: Habit) =>
        shouldHabitBeDoneThisWeek(
          h,
          startCurrentWeek,
          endCurrentWeek,
          startCurrentMonth,
          endCurrentMonth,
          currentDay,
          nbOfDaysInCurrentMonth
        )
      );
    } else {
      return habits.filter((h: Habit) =>
        shouldHabitBeDoneThisMonth(
          h,
          startCurrentWeek,
          endCurrentWeek,
          startCurrentMonth,
          endCurrentMonth,
          currentDate
        )
      );
    }
  }, [habits, frequence, filter]);

  const taskList = useMemo(() => {
    if (!filter[1].checked) return [];
    return tasks;
  }, [tasks, filter]);

  const habitsAndTaskList = [...habitList, ...taskList];

  if (habitsAndTaskList.length < 1)
    return <NoHabitOrTask frequence={frequence} />;

  return (
    <>
      {habitsAndTaskList.map((doc) => {
        const type = "frequency" in doc ? "habit" : "task";
        const isOverdue =
          type === "task" && new Date((doc as Task).dueDate) < new Date();

        return (
          <Pressable
            key={doc.id}
            style={{
              backgroundColor: isOverdue
                ? constants.colorWarning
                : constants.colorSecondary,
              padding: constants.padding * 2,
              marginBottom: constants.padding * 2,
              borderRadius: 10,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: constants.padding * 2,
            }}
            onPress={() => router.push(`/${type}?id=${doc.id}`)}
          >
            {type === "habit" ? (
              <FontAwesome5
                name="trophy"
                size={20}
                color={constants.colorTertiary}
              />
            ) : (
              <Feather
                name="target"
                size={24}
                color={constants.colorTertiary}
              />
            )}
            <View
              style={{
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontWeight: constants.fontWeight,
                  fontSize: constants.mediumFontSize,
                  color: constants.colorTertiary,
                  width: "100%",
                }}
              >
                {doc.title}
              </Text>
            </View>
          </Pressable>
        );
      })}
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
});
