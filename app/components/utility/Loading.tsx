import constants from "@/app/constants";
import { View, ActivityIndicator, StyleSheet } from "react-native";

type Props = {
  isLoading?: boolean;
};

export default function LoadingComponent({ isLoading = true }: Props) {
  if (!isLoading) return <></>;
  return (
    <View style={styles.container}>
      {/* ActivityIndicator provides a rotating spinner */}
      <ActivityIndicator size={80} color={constants.colorQuarternary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
