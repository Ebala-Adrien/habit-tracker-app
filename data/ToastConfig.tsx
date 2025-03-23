import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";
import constants from "../constants";

export type BaseToastProps = {
  text1?: string;
  text2?: string;
  onPress?: () => void;
  activeOpacity?: number;
  renderLeadingIcon?: () => React.ReactNode;
  renderTrailingIcon?: () => React.ReactNode;
};
// https://github.com/calintamas/react-native-toast-message/blob/0026645eeda2242ea740250471f1b4f2be894c6e/src/types/index.ts#L86-L103

const ToastConfig = {
  deletedHabitToast: ({ text1 }: { text1?: string }) => (
    <View
      style={{
        backgroundColor: constants.colorSecondary,
        width: "90%",
        padding: constants.padding,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: constants.padding * 2,
      }}
    >
      <Ionicons
        name="checkmark-done-circle-outline"
        size={50}
        color={constants.colorSuccess}
        style={{ width: 50 }}
      />
      <Text
        style={{
          fontSize: constants.mediumFontSize,
          fontWeight: constants.fontWeight,
          maxWidth: "90%",
          textAlign: "center",
        }}
      >
        {text1}
      </Text>
    </View>
  ),
};

export default ToastConfig;
