import constants from "@/constants";
import { useTaskContext } from "@/contexts/TaskContext";
import { Task } from "@/types";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, Text } from "react-native";

type Props = {
  frequence: "Day" | "Week" | "Month" | "Overall";
};

export default function TaskList({}: Props) {
  const router = useRouter();

  const { tasks } = useTaskContext();

  const list: Task[] = useMemo(() => {
    return tasks;
  }, [tasks]);

  return (
    <>
      {list.map((task) => (
        <Pressable
          key={task.id}
          style={{
            backgroundColor: constants.colorSecondary,
            padding: constants.padding * 2,
            marginBottom: constants.padding * 2,
            borderRadius: 10,
          }}
          onPress={() => router.push(`/task?id=${task.id}`)}
        >
          <Text
            style={{
              fontWeight: constants.fontWeight,
              fontSize: constants.mediumFontSize,
            }}
          >
            {task.title}
          </Text>
        </Pressable>
      ))}
    </>
  );
}
