import constants from "@/constants";
import { useMenuContext } from "@/contexts/MenuContext";
import { Pressable, View, Text } from "react-native";
import Checkbox from "expo-checkbox";
import { useState } from "react";

export default function HabitAndTaskFilter() {
  const { setShowFilter, filter, setFilter } = useMenuContext();

  return (
    <Pressable
      style={{
        position: "absolute",
        flex: 1,
        width: "100%",
        height: "100%",
        zIndex: 100,
        display: "flex",
      }}
      onPress={() => setShowFilter(false)}
    >
      <View
        style={{
          width: "100%",
          backgroundColor: constants.colorQuarternary,
          padding: constants.padding,
          display: "flex",
          gap: constants.padding * 2,
          borderColor: constants.colorTertiary,
        }}
      >
        {filter
          .sort((a, b) => a.id - b.id)
          .map((o, i) => {
            return (
              <View
                key={o.name}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomRightRadius: 10,
                  borderBottomLeftRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontWeight: constants.fontWeight,
                    fontSize: constants.mediumFontSize,
                    color: constants.colorSecondary,
                  }}
                >
                  {o.name}
                </Text>
                <Checkbox
                  color={o.checked ? "black" : undefined}
                  style={{
                    backgroundColor: constants.colorSecondary,
                    borderColor: constants.colorTertiary,
                  }}
                  value={o.checked}
                  onValueChange={() => {
                    const newFilterState = filter.filter((ob) => ob.id != o.id);

                    setFilter([
                      ...newFilterState,
                      {
                        ...o,
                        checked: !o.checked,
                      },
                    ]);
                  }}
                />
              </View>
            );
          })}
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: constants.colorSextary,
          opacity: 0.8,
        }}
      ></View>
    </Pressable>
  );
}
