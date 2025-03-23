import constants from "@/constants";
import { useMenuContext } from "@/contexts/MenuContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { Pressable, Text, View, StyleSheet, Animated } from "react-native";
import React, { useEffect, useRef } from "react";

export default function CreateHabitOrTaskModal() {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, []);

  const listItems = [
    {
      id: 1,
      title: "Habit",
      href: "/createHabit",
      description:
        "Activity that repeats over time. It has detailed tracking and statistics.",
      icon: (
        <AntDesign name="Trophy" size={28} color={constants.colorPrimary} />
      ),
    },
    {
      id: 2,
      title: "Task",
      href: "/CreateTask",
      description: "Single instance activity.",
      icon: (
        <AntDesign
          name="checksquareo"
          size={28}
          color={constants.colorPrimary}
        />
      ),
    },
  ] as const;

  const { setShowCreateTaskOrHabitModal } = useMenuContext();

  return (
    <Pressable
      style={styles.overlay}
      onPress={() => setShowCreateTaskOrHabitModal(false)}
    >
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.handle} />
        <Text style={styles.modalTitle}>Create New</Text>
        <View style={styles.itemsContainer}>
          {listItems.map((item, index) => (
            <Pressable
              key={item.id}
              onPress={() => router.push(item.href)}
              style={[styles.itemButton, index > 0 && styles.itemButtonBorder]}
            >
              <View style={styles.iconContainer}>{item.icon}</View>
              <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    zIndex: 100,
  },
  modalContainer: {
    backgroundColor: constants.colorSecondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    shadowColor: constants.colorTertiary,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: constants.colorQuaternary,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: constants.colorTertiary,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  itemsContainer: {
    gap: 8,
  },
  itemButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingHorizontal: 24,
  },
  itemButtonBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: constants.colorQuaternary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: `${constants.colorPrimary}10`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: constants.colorTertiary,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: constants.colorQuinary,
    lineHeight: 20,
  },
});
