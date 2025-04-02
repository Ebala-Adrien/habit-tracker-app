import { Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Task } from "@/types";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import DeleteModal from "@/components/habitOrTask/modal/DeleteHabitOrTask";
import LoadingComponent from "@/components/utility/Loading";
import constants from "@/constants";
import ErrorComponent from "@/components/utility/Error";
import HeaderTask from "@/components/habitOrTask/HeaderHabitOrTaskPage";
import styles from "@/components/habitOrTask/styles/habit_or_task_page";
import TextBlock from "@/components/habitOrTask/display/TextBlock";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TaskPage() {
  const router = useRouter();
  const id = useLocalSearchParams().id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const docRef = doc(db, "task", id.toString());

  useEffect(() => {
    getDoc(docRef)
      .then((doc) => {
        if (doc.exists()) {
          setTask({ id: doc.id, ...doc.data() } as Task);
        } else {
          setError(new Error("Task not found"));
        }
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleComplete = () => {
    if (!task) return;

    updateDoc(docRef, {
      completed: true,
      completedAt: new Date().toUTCString(),
      updatedAt: new Date().toUTCString(),
    })
      .then(() => {
        router.push("/(tabs)");
      })
      .catch(() =>
        console.error(`Error: We couldn't update the task ${task?.title}`)
      );
  };

  if (loading) {
    return <LoadingComponent size={80} color={constants.colorPrimary} />;
  }

  if (error || !task) {
    return <ErrorComponent />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right", "bottom"]}>
      <ScrollView style={styles.scrollView}>
        <HeaderTask
          id={id}
          type="Task"
          setShowDeleteModal={setShowDeleteModal}
        />
        <View style={styles.page_content_container}>
          <Text style={styles.page_title}>{task.title}</Text>
          <TextBlock title="Description" text={task.description} />
          <Pressable
            style={{
              backgroundColor: constants.colorPrimary,
              padding: constants.padding,
              margin: constants.padding,
              borderRadius: 10,
              alignItems: "center",
            }}
            onPress={handleComplete}
          >
            <Text
              style={{
                color: constants.colorSecondary,
                fontWeight: constants.fontWeight,
                fontSize: constants.mediumFontSize,
              }}
            >
              Complete
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {showDeleteModal && (
        <DeleteModal
          id={id}
          setShowModal={setShowDeleteModal}
          task={task}
          type="task"
        />
      )}
    </SafeAreaView>
  );
}
