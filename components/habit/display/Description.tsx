import constants from "@/constants";
import { View, Text } from "react-native";

type Props = {
  description: string | undefined;
};

export default function Description({ description }: Props) {
  if (!description) return <></>;

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
            Description
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
          {description}
        </Text>
      </View>
    </View>
  );
}
