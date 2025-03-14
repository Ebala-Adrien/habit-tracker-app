import constants from "@/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

export default function () {
  const router = useRouter();

  return (
    <View
      style={{
        backgroundColor: constants.colorSecondary,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        paddingVertical: constants.padding,
      }}
    >
      {/* Back Button */}
      <Pressable
        style={{ padding: constants.padding }}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={28} color={constants.colorTertiary} />
      </Pressable>
    </View>
  );
}
