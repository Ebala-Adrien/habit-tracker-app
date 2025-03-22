import constants from "@/constants";
import { useMenuContext } from "@/contexts/MenuContext";
import { Pressable, View, Text, StyleSheet, Animated } from "react-native";
import Checkbox from "expo-checkbox";
import React, { useEffect, useRef } from "react";

export default function HabitAndTaskFilter() {
  const { setShowFilter, filter, setFilter } = useMenuContext();
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      duration: 250,
    }).start();
  }, []);

  return (
    <Pressable style={styles.overlay} onPress={() => setShowFilter(false)}>
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-100, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.modalTitle}>Filter</Text>
        <View style={styles.itemsContainer}>
          {filter
            .sort((a, b) => a.id - b.id)
            .map((item, index) => (
              <Pressable
                key={item.name}
                style={[
                  styles.filterItem,
                  index === filter.length - 1 && styles.lastFilterItem,
                ]}
                onPress={() => {
                  const newFilterState = filter.filter(
                    (ob) => ob.id != item.id
                  );
                  setFilter([
                    ...newFilterState,
                    {
                      ...item,
                      checked: !item.checked,
                    },
                  ]);
                }}
              >
                <Text style={styles.filterText}>{item.name}</Text>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={item.checked}
                    onValueChange={() => {
                      const newFilterState = filter.filter(
                        (ob) => ob.id != item.id
                      );
                      setFilter([
                        ...newFilterState,
                        {
                          ...item,
                          checked: !item.checked,
                        },
                      ]);
                    }}
                    color={item.checked ? constants.colorPrimary : undefined}
                    style={styles.checkbox}
                  />
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
    zIndex: 100,
  },
  modalContainer: {
    backgroundColor: constants.colorSecondary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: constants.colorQuinary,
    shadowColor: constants.colorTertiary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: constants.colorTertiary,
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  itemsContainer: {
    gap: 4,
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingHorizontal: 24,
  },
  lastFilterItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: constants.colorQuinary,
    marginBottom: 8,
  },
  filterText: {
    fontSize: 17,
    color: constants.colorTertiary,
    flex: 1,
  },
  checkboxContainer: {
    marginLeft: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: constants.colorPrimary,
  },
});
