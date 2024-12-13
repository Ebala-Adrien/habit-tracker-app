import { View, Text, Pressable } from "react-native";
import constants from "../constants";
import { useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useHabitContext } from "../contexts/HabitContext";

export default function HomeScreen() {
  const router = useRouter();

  const frequences = ["Today", "Weekly", "Monthly", "Overall"];
  const [frequence, setFrequence] = useState(frequences[0]);

  const { habits } = useHabitContext();

  return (
    <View>
      <Text
        style={{
          fontSize: constants.largeFontSize,
          fontWeight: constants.fontWeight,
          padding: constants.padding,
        }}
      >
        Habits
      </Text>
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          padding: constants.padding,
          marginBottom: constants.margin * 10,
        }}
      >
        {frequences.map((r) => {
          const isCurrentFrequence = frequence === r;

          return (
            <Pressable key={r} onPress={() => setFrequence(r)}>
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: constants.mediumFontSize,
                  color: isCurrentFrequence ? "black" : "grey",
                  backgroundColor: isCurrentFrequence ? "white" : "transparent",
                  paddingHorizontal: constants.padding * 2,
                  paddingVertical: constants.padding,
                  borderRadius: 50,
                }}
                key={r}
              >
                {r}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {habits.length < 1 ? (
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
            No habits for today
          </Text>
          <Text>There is no habit for today. Create one?</Text>
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
      ) : frequence === "Overall" ? (
        <View
          style={{
            paddingHorizontal: constants.padding * 2,
          }}
        >
          {habits.map((h) => {
            const { id, title } = h;

            return (
              <Pressable
                key={id}
                style={{
                  backgroundColor: constants.colorSecondary,
                  padding: constants.padding * 2,
                  borderRadius: 10,
                }}
                onPress={() => router.push(`/habit?id=${id}`)}
              >
                <Text
                  style={{
                    fontWeight: constants.fontWeight,
                    fontSize: constants.mediumFontSize,
                  }}
                >
                  {title}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Text>Currently it is just a placeholder</Text>
      )}
    </View>
  );
}
