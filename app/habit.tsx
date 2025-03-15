import React, { useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import LoadingComponent from '@/components/utility/Loading';
import ErrorComponent from '@/components/utility/Error';
import DeleteModal from '@/components/habitOrTask/modal/DeleteHabitOrTask';
import HeaderHabit from '@/components/habitOrTask/HeaderHabitOrTaskPage';
import TextBlock from '@/components/habitOrTask/display/TextBlock';
import HabitStats from '@/components/habit/HabitStats';
import HabitHistory from '@/components/habit/HabitHistory';
import { useHabitContext } from '@/contexts/HabitContext';
import styles from '@/components/habitOrTask/styles/habit_or_task_page';
import constants from '@/constants';

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
    return <LoadingComponent size={80} color={constants.colorSecondary} />;
  }

  if (error || !currentHabit) {
    return <ErrorComponent />;
  }

  return (
    <>
      <ScrollView style={styles.scrollView}>
        <HeaderHabit
          id={id}
          type="Habit"
          setShowDeleteModal={setShowDeleteModal}
        />
        <View style={styles.page_content_container}>
          <Text style={styles.page_title}>{currentHabit.title}</Text>
          <HabitStats habit={currentHabit} />
          <HabitHistory />
          <TextBlock title="Description" text={currentHabit.description} />
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
