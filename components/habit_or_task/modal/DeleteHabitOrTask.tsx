import constants from "@/constants";
import { Dispatch, SetStateAction } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Habit, Task } from "@/types";
import { calculateHowManyTimesDidAHabitHaveToBeDoneBetweenTwoDates } from "@/utility";

type Props =
  | {
      id: string;
      setShowModal: Dispatch<SetStateAction<boolean>>;
      habit: Habit | null;
      task?: never;
      type: "habit";
    }
  | {
      id: string;
      setShowModal: Dispatch<SetStateAction<boolean>>;
      task: Task | null;
      habit?: never;
      type: "task";
    };

export default function DeleteModal({
  id,
  setShowModal,
  habit,
  task,
  type,
}: Props) {
  const router = useRouter();

  const document = habit || task;

  const handleDelete = () => {
    if (!document) return console.error("Error: No document to delete");

    if (habit) {
      let timesDoneSinceLastUpdate =
        calculateHowManyTimesDidAHabitHaveToBeDoneBetweenTwoDates(
          habit,
          Math.max(
            new Date(habit.lastFrequencyUpdate).getTime(),
            new Date(habit.createdAt).getTime()
          ),
          Math.max(new Date().getTime())
        ); // How many times it had to be done between the last update and now

      if (
        habit.habitCompletions.length > 1 ||
        habit.timesDoneBeforeFreqUpdate > 0
        // The habit should be archived because we can compute stats from it
      ) {
        addDoc(collection(db, "archivedHabit"), {
          ...habit,
          lastFrequencyUpdate: new Date().toUTCString(),
          updatedAt: new Date().toUTCString(),
          timesDoneBeforeFreqUpdate:
            habit.timesDoneBeforeFreqUpdate + timesDoneSinceLastUpdate,
        })
          .then(() => {})
          .catch(() => console.error("Error: We couldn't archive the habit"));
      }
    }

    deleteDoc(doc(db, type, id))
      .then(() => {})
      .catch(() => console.error(`Error: We couldn't delete the ${type}`));

    setShowModal(false);
    router.push(
      `/?deleteHabitMsg=The ${type} "${document.title}" has been deleted`
    );
  };

  return (
    <View style={styles.modal}>
      <View style={styles.modal_content_container}>
        <Text style={[styles.modal_title]}>Delete the {document?.title}?</Text>
        <Text>This action is permanent and cannot be reverted.</Text>
        <View style={styles.buttons_container}>
          <Pressable
            style={[styles.button, styles.delete_button]}
            onPress={handleDelete}
          >
            <Text style={[styles.button_text, styles.delete_text]}>
              Yes, delete
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setShowModal(false)}
            style={[styles.button, styles.cancel_button]}
          >
            <Text style={[styles.button_text, styles.cancel_text]}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    position: "fixed",
    bottom: 0,
  },
  modal_content_container: {
    backgroundColor: constants.colorSecondary,
    padding: constants.padding * 2,
    marginBottom: constants.margin * 5,
    marginHorizontal: constants.margin * 5,
    display: "flex",
    gap: constants.padding,
    borderRadius: 10,
  },
  modal_title: {
    fontSize: constants.mediumFontSize,
    fontWeight: constants.fontWeight,
  },
  modal_description: {
    fontSize: constants.mediumFontSize,
  },
  buttons_container: {
    gap: constants.padding,
  },
  button: {
    color: constants.colorQuarternary,
    borderRadius: 5,
    padding: constants.padding,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  delete_button: {
    backgroundColor: constants.colorQuarternary,
  },
  cancel_button: {
    backgroundColor: constants.colorQuinary,
  },
  button_text: {
    fontSize: constants.mediumFontSize,
    fontWeight: constants.fontWeight,
  },
  delete_text: {
    color: constants.colorSecondary,
  },
  cancel_text: {
    color: constants.colorQuarternary,
  },
});