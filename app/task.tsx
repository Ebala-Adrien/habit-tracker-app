import { Pressable, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Task } from "@/types";
import { addDoc, collection, deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import DeleteModal from "@/components/habit_or_task/modal/DeleteHabitOrTask";
import LoadingComponent from "@/components/utility/Loading";
import constants from "@/constants";
import ErrorComponent from "@/components/utility/Error";
import HeaderTask from "@/components/habit_or_task/HeaderHabitOrTaskPage";
import styles from "@/components/habit_or_task/styles/habit_or_task_page";
import TextBlock from "@/components/habit_or_task/display/TextBlock";

export default function TaskPage() {
  const router = useRouter();
  const id = useLocalSearchParams().id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const docRef = doc(db, "task", id.toString());

  const handleComplete = () => {
    addDoc(collection(db, "archivedTask"), {
      ...task,
      updatedAt: new Date().toUTCString(),
      completedAt: new Date().toUTCString(),
    })
      .then(() => {})
      .catch(() =>
        console.error(`Error: We couldn't delete the task ${task?.title}`)
      );
    deleteDoc(docRef)
      .then(() => {})
      .catch(() =>
        console.error(`Error: We couldn't delete the task ${task?.title}`)
      );
    router.push("/(tabs)");
  };

  useEffect(() => {
    getDoc(docRef)
      .then((doc) => {
        if (doc.exists()) {
          const docData = doc.data() as Task;
          setTask(docData);
        } else {
          throw new Error("The doc doesn't exist");
        }
      })
      .catch((e) => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
        }}
      >
        {loading ? (
          <LoadingComponent size={80} color={constants.colorSecondary} />
        ) : error || !task ? (
          <ErrorComponent />
        ) : (
          <>
            <HeaderTask
              id={id}
              type="task"
              setShowDeleteModal={setShowDeleteModal}
            />

            <View style={styles.page_content_container}>
              <Text style={styles.page_title}>{task.title}</Text>

              <TextBlock title={"Description"} text={task.description} />
              <TextBlock title={"Due date"} text={task.dueDate} />

              <Pressable
                style={{
                  backgroundColor: constants.colorQuarternary,
                  margin: constants.padding,
                  borderRadius: 10,
                  padding: constants.padding,
                }}
                onPress={handleComplete}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: constants.fontWeight,
                    fontSize: constants.mediumFontSize,
                    color: constants.colorSecondary,
                  }}
                >
                  Mark as completed
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
      {showDeleteModal && (
        <DeleteModal
          id={id}
          setShowModal={setShowDeleteModal}
          task={task}
          type="task"
        />
      )}
    </>
  );
}
