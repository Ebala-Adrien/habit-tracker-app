import React, { useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import constants from "@/constants";

interface ConfirmationMessageProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function ConfirmationMessage({
  message,
  onClose,
  duration = 3000,
}: ConfirmationMessageProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Auto hide after duration
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        onClose();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.messageContainer}>
          <Ionicons
            name="checkmark-done-circle-outline"
            size={30}
            color={constants.colorSuccess}
            style={styles.icon}
          />
          <Text style={styles.message}>{message}</Text>
        </View>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={20} color={constants.colorQuinary} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: "5%",
    right: "5%",
    zIndex: 1000,
  },
  content: {
    backgroundColor: constants.colorSecondary,
    padding: constants.padding,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: constants.colorTertiary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: constants.padding,
  },
  message: {
    fontSize: constants.mediumFontSize,
    fontWeight: constants.fontWeight,
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
});
