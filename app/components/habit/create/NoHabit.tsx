import constants from "@/app/constants";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

const messageObject = {
  Day: "for today",
  Week: "for the current week",
  Month: "for the current month",
  Overall: "at all",
} as const;

type Props = {
  frequence: keyof typeof messageObject;
};

export default function NoHabit({ frequence }: Props) {
  const router = useRouter();
  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        gap: constants.padding * 1.5,
      }}
    >
      <MaterialCommunityIcons
        name="sleep"
        size={24}
        color={constants.colorQuarternary}
        style={{ textAlign: "center" }}
      />
      <Text
        style={{
          fontSize: constants.mediumFontSize,
          fontWeight: constants.fontWeight,
        }}
      >
        No habits {messageObject[frequence]}
      </Text>
      <Text>There is no habit {messageObject[frequence]}. Create one?</Text>
      <Pressable
        onPress={() => router.push("/create-habit")}
        style={{
          paddingHorizontal: constants.padding * 2,
          paddingVertical: constants.padding,
          backgroundColor: constants.colorQuarternary,
          borderRadius: 50,
        }}
      >
        <Text
          style={{
            color: constants.colorSecondary,
            fontWeight: constants.fontWeight,
            fontSize: constants.mediumFontSize,
          }}
        >
          + Create
        </Text>
      </Pressable>
    </View>
  );
}
