import LoadingComponent from "@/components/utility/Loading";
import constants from "@/constants";
import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import EditTaskInputs from "./EditTaskInputs";
import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { SubmitHandler } from "react-hook-form";
import { useTaskContext } from "@/contexts/TaskContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { get } from "lodash";
import { Task } from "@/types";

type Props = {
  id?: string;
};

export default function EditTask({ id }: Props) {
  const { user } = useAuthContext();
  const router = useRouter();

  const { editTaskForm } = useTaskContext();
  const { handleSubmit, reset, setValue } = editTaskForm;

  const [loading, setLoading] = useState(false);
  const [dueDate, setDueDate] = useState<Date>(() => {
    const currentDate = new Date();
    const defaultDueDate = new Date(
      currentDate.getTime() + 48 * 60 * 60 * 1000
    ); // 48 hours from now
    return defaultDueDate;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onSubmit: SubmitHandler<any> = async (data) => {
    setLoading(true);

    try {
      if (!id) {
        if (!user?.uid) throw new Error("Custom error: No user ID");

        // Create new task
        await addDoc(collection(db, "task"), {
          ...data,
          userId: user.uid,
          dueDate: dueDate.toUTCString(),
          updatedAt: new Date().toUTCString(),
          createdAt: new Date().toUTCString(),
          completedAt: null,
        });
        reset();
        setLoading(false);
        router.push("/");
      } else {
        await updateDoc(doc(db, "task", id), {
          ...data,
          dueDate: dueDate.toUTCString(),
          updatedAt: new Date().toUTCString(),
        });
        reset();
        setLoading(false);
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      const docRef = doc(db, "task", id);

      getDoc(docRef)
        .then((doc) => {
          if (doc.exists()) {
            const docData = doc.data() as Task;
            setValue("title", docData.title);
            setValue("description", docData.description);
            setDueDate(new Date(docData.dueDate));
          } else {
            throw new Error("The doc doesn't exist");
          }
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  if (loading)
    return <LoadingComponent size={80} color={constants.colorPrimary} />;

  return (
    <ScrollView style={styles.container}>
      <EditTaskInputs />

      {/* Due Date Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Due Date</Text>
        <View style={styles.dueDateContainer}>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateTimeText}>
              {dueDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.dateTimeText}>
              {dueDate.toLocaleTimeString()}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            onChange={(e) => {
              const { timestamp } = e.nativeEvent;
              const newDateYear = new Date(timestamp).getFullYear();
              const newDateMonth = new Date(timestamp).getMonth();
              const newDateDay = new Date(timestamp).getDate();
              const oldDateHours = dueDate.getHours();
              const oldDateMinutes = dueDate.getMinutes();

              const newDate = new Date(
                newDateYear,
                newDateMonth,
                newDateDay,
                oldDateHours,
                oldDateMinutes,
                0,
                0
              );

              setDueDate(newDate);
              setShowDatePicker(false);
            }}
            mode="date"
            value={dueDate}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            onChange={(e) => {
              const { timestamp } = e.nativeEvent;
              const oldDateYear = dueDate.getFullYear();
              const oldDateMonth = dueDate.getMonth();
              const oldDateDay = dueDate.getDate();
              const newDateHours = new Date(timestamp).getHours();
              const newDateMinutes = new Date(timestamp).getMinutes();

              const newDate = new Date(
                oldDateYear,
                oldDateMonth,
                oldDateDay,
                newDateHours,
                newDateMinutes,
                0,
                0
              );

              setDueDate(newDate);
              setShowTimePicker(false);
            }}
            mode="time"
            value={dueDate}
          />
        )}
      </View>

      <Pressable style={styles.saveButton} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.saveButtonText}>Save Task</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: constants.colorQuaternary,
  },
  section: {
    backgroundColor: constants.colorSecondary,
    margin: constants.padding,
    padding: constants.padding * 1.5,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: constants.mediumFontSize * 1.1,
    fontWeight: "700",
    marginBottom: constants.padding * 1.5,
    color: constants.colorTertiary,
  },
  dueDateContainer: {
    flexDirection: "row",
    gap: constants.padding,
  },
  dateTimeButton: {
    flex: 1,
    backgroundColor: constants.colorQuaternary,
    borderRadius: 10,
    padding: constants.padding,
    alignItems: "center",
    borderWidth: 1,
    borderColor: constants.colorPrimary,
  },
  dateTimeText: {
    fontSize: constants.mediumFontSize,
    color: constants.colorTertiary,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: constants.colorPrimary,
    margin: constants.padding,
    marginBottom: constants.padding * 2,
    borderRadius: 15,
    padding: constants.padding * 1.2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: constants.mediumFontSize,
    color: constants.colorSecondary,
  },
});
