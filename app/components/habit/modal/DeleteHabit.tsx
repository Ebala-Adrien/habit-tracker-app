import constants from "@/app/constants";
import { Dispatch, SetStateAction } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

type Props = {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  habitId: string;
  habitTitle: string | undefined;
};

export default function DeleteModal({
  setShowModal,
  habitTitle,
  habitId,
}: Props) {
  const router = useRouter();

  const handleDelete = () => {
    deleteDoc(doc(db, "habit", habitId))
      .then(() => {})
      .catch(() => console.log("We couldn't delete the item"));

    setShowModal(false);
    router.push(`/?deleteHabitMsg=The habit "${habitTitle}" has been deleted`);
  };

  return (
    <View style={styles.modal}>
      <View style={styles.modal_content_container}>
        <Text style={[styles.modal_title]}>Delete the habit?</Text>
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
