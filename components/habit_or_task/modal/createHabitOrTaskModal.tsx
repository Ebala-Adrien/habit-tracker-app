import constants from "@/constants";
import { useMenuContext } from "@/contexts/MenuContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function CreateHabitOrTaskModal() {
  const listItems = [
    {
      id: 1,
      title: "Habit",
      href: "/create-habit",
      description:
        "Activity that repeats over time. It has detailed tracking and statistics.",
      icon: <AntDesign name="Trophy" size={24} color="black" />,
    },
    {
      id: 2,
      title: "Task",
      href: "/create-task",
      description: "Single instance activity.",
      icon: <AntDesign name="checksquareo" size={24} color="black" />,
    },
  ] as const;

  const { setShowCreateTaskOrHabitModal } = useMenuContext();

  return (
    <Pressable
      style={{
        position: "absolute",
        flex: 1,
        width: "100%",
        height: "100%",
        zIndex: 100,
        display: "flex",
        justifyContent: "flex-end",
        borderRadius: 10,
      }}
      onPress={() => setShowCreateTaskOrHabitModal(false)}
    >
      <View
        style={{
          backgroundColor: constants.colorSecondary,
          gap: constants.padding,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}
      >
        {listItems.map((r, i) => {
          return (
            <Pressable
              onPress={() => router.push(r.href)}
              key={r.id}
              style={{
                flexDirection: "row",
                gap: 10,
                padding: 10,
                borderTopColor: i > 0 ? constants.colorTertiary : undefined,
                borderTopWidth: i > 0 ? 0.5 : undefined,
                minHeight: 90,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  padding: constants.padding,
                }}
              >
                {r.icon}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: constants.fontWeight }}>
                  {r.title}
                </Text>
                <Text>{r.description}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </Pressable>
  );
}