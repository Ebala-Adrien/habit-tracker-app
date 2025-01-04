import constants from "@/constants";
import { useMenuContext } from "@/contexts/MenuContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { View, Text, Pressable } from "react-native";

const messageObject = {
  Day: "for today",
  Week: "for the current week",
  Month: "for the current month",
  Overall: "at all",
} as const;

type Props = {
  frequence: keyof typeof messageObject;
};

export default function NoHabitOrTask({ frequence }: Props) {
  const { setShowCreateTaskOrHabitModal } = useMenuContext();

  return (
    <View
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        gap: constants.padding * 1.5,
        padding: constants.padding,
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
        Nothing {messageObject[frequence]}
      </Text>
      <Text>
        There is nothing to do {messageObject[frequence]}. Create one?
      </Text>
      <Pressable
        onPress={() => setShowCreateTaskOrHabitModal(true)}
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
