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
    <ScrollView>
      <EditTaskInputs />

      <View style={styles.page_block}>
        <View style={styles.due_date_block_title_container}>
          <Text style={styles.due_date_block_title}>Due date</Text>

          <View style={styles.due_date_display_container}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View>
                <Text style={[styles.due_date_text, styles.due_date_date_text]}>
                  {dueDate.toLocaleDateString()}
                </Text>
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
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <View>
                <Text style={[styles.due_date_text, styles.due_date_time_text]}>
                  {dueDate.toLocaleTimeString()}
                </Text>
              </View>
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
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Pressable style={styles.save_button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.save_button_text}>Save</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page_block: {
    backgroundColor: constants.colorSecondary,
    margin: constants.padding,
    padding: constants.padding,
    borderRadius: 10,
  },
  due_date_block_title_container: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: constants.padding,
  },
  due_date_block_title: {
    fontSize: constants.mediumFontSize,
    fontWeight: constants.fontWeight,
  },
  due_date_display_container: {
    display: "flex",
    flexDirection: "row",
  },
  due_date_text: {
    backgroundColor: constants.colorQuaternary,
    padding: constants.padding,
    color: constants.colorTertiary,
    fontSize: constants.smallFontSize,
    fontWeight: "500",
  },
  due_date_date_text: {
    paddingRight: constants.padding / 2,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderWidth: 1,
    borderColor: constants.colorBorder,
  },
  due_date_time_text: {
    paddingLeft: constants.padding / 2,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderColor: constants.colorBorder,
  },
  save_button: {
    backgroundColor: constants.colorPrimary,
    margin: constants.padding,
    borderRadius: 10,
    padding: constants.padding,
  },
  save_button_text: {
    textAlign: "center",
    fontWeight: constants.fontWeight,
    fontSize: constants.mediumFontSize,
    color: constants.colorSecondary,
  },
});
