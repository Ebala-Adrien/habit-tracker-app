import constants from "@/constants";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  text?: string;
};

export default function ErrorComponent({
  text = "An error occurred...",
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: constants.colorError,
    fontSize: constants.mediumFontSize,
  },
});
