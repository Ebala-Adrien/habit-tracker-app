import React, { useEffect } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import LoadingComponent from "@/components/utility/Loading";
import ErrorComponent from "@/components/utility/Error";
import DeleteModal from "@/components/habitOrTask/modal/DeleteHabitOrTask";
import HeaderHabit from "@/components/habitOrTask/HeaderHabitOrTaskPage";
import HabitStats from "@/components/habit/HabitStats";
import HabitHistory from "@/components/habit/HabitHistory";
import { useHabitContext } from "@/contexts/HabitContext";
import constants from "@/constants";

export default function HabitPage() {
  const id = useLocalSearchParams().id as string;
  const {
    loading,
    error,
    currentHabit,
    loadHabit,
    showDeleteModal,
    setShowDeleteModal,
  } = useHabitContext();

  useEffect(() => {
    loadHabit(id);
  }, [id, loadHabit]);

  if (loading) {
    return <LoadingComponent size={80} color={constants.colorPrimary} />;
  }

  if (error || !currentHabit) {
    return <ErrorComponent />;
  }
  return (
    <>
      <ScrollView style={styles.container}>
        <HeaderHabit
          id={id}
          type="Habit"
          setShowDeleteModal={setShowDeleteModal}
        />

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{currentHabit.title}</Text>
          </View>

          {/* Stats Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Stats</Text>
            </View>
            <HabitStats habit={currentHabit} />
          </View>

          {/* History Section */}
          <HabitHistory habitId={id} />

          {/* Description Card */}
          {currentHabit.description && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Description</Text>
              </View>
              <Text style={styles.description}>{currentHabit.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {showDeleteModal && (
        <DeleteModal
          id={id}
          setShowModal={setShowDeleteModal}
          habit={currentHabit}
          type="habit"
        />
      )}
    </>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: constants.colorBackground,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: constants.padding * 2,
    paddingBottom: constants.padding * 3,
  },
  titleSection: {
    marginVertical: constants.padding * 2,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: constants.colorTertiary,
    marginBottom: constants.padding,
  },
  card: {
    backgroundColor: constants.colorSecondary,
    borderRadius: 16,
    marginBottom: constants.padding * 2,
    padding: constants.padding * 2,
    shadowColor: constants.colorTertiary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: constants.padding * 1.5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: constants.colorTertiary,
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    color: constants.colorTertiary,
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  statsContainer: {
    alignItems: "center",
    padding: constants.padding,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: "600",
    color: constants.colorTertiary,
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 14,
    color: constants.colorTertiary,
    fontWeight: "500",
  },
});
