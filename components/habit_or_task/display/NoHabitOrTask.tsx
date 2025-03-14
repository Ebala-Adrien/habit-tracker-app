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
  const { setShowCreateTaskOrHabitModal, filter, setShowFilter } =
    useMenuContext();
  const emptyFilter = filter.every((f) => !f.checked);

  const firstMessage = emptyFilter
    ? "Filters on"
    : `Nothing ${messageObject[frequence]}`;

  const secondMessage = emptyFilter
    ? "Remove filters to see tasks and habits"
    : `There is nothing to do ${messageObject[frequence]}. Create one?`;

  const buttonText = emptyFilter ? "Change filters" : "+ Create";

  const buttonFunction = emptyFilter
    ? () => setShowFilter(true)
    : () => setShowCreateTaskOrHabitModal(true);

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
        {firstMessage}
      </Text>
      <Text>{secondMessage}</Text>
      <Pressable
        onPress={buttonFunction}
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
          {buttonText}
        </Text>
      </Pressable>
    </View>
  );
}
