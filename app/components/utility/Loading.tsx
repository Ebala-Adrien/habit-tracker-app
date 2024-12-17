import constants from "@/app/constants";
import { View, ActivityIndicator, StyleSheet } from "react-native";

type Props = {
  isLoading?: boolean;
  size: number;
  color: string;
};

export default function LoadingComponent({
  isLoading = true,
  size,
  color,
}: Props) {
  if (!isLoading) return <></>;
  return (
    <View style={styles.container}>
      {/* ActivityIndicator provides a rotating spinner */}
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
