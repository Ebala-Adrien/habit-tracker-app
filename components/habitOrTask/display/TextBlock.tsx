import constants from "@/constants";
import React, { View, Text } from "react-native";

type Props = {
  title: string;
  text: string | undefined;
};

export default function TextBlock({ title, text }: Props) {
  if (!text) return <></>;

  return (
    <View>
      <View
        style={{
          margin: constants.padding,
          flex: 1,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontWeight: constants.fontWeight,
              fontSize: constants.mediumFontSize,
            }}
          >
            {title}
          </Text>
        </View>
      </View>

      <View
        style={{
          marginHorizontal: constants.padding,
        }}
      >
        <Text
          style={{
            backgroundColor: constants.colorSecondary,
            borderRadius: 10,
            padding: constants.padding,
          }}
        >
          {text}
        </Text>
      </View>
    </View>
  );
}
