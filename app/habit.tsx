import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import LoadingComponent from '@/components/utility/Loading';
import ErrorComponent from '@/components/utility/Error';
import DeleteModal from '@/components/habitOrTask/modal/DeleteHabitOrTask';
import HeaderHabit from '@/components/habitOrTask/HeaderHabitOrTaskPage';
import TextBlock from '@/components/habitOrTask/display/TextBlock';
import HabitStats from '@/components/habit/HabitStats';
import HabitHistory from '@/components/habit/HabitHistory';
import { useHabit } from '@/hooks/useHabit';
import styles from '@/components/habitOrTask/styles/habit_or_task_page';
import constants from '../constants';

export default function HabitPage() {
  const id = useLocalSearchParams().id as string;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { habit, setHabit, loading, error } = useHabit(id);

  if (loading) {
    return <LoadingComponent size={80} color={constants.colorSecondary} />;
  }

  if (error || !habit) {
    return <ErrorComponent />;
  }

  return (
    <>
      <ScrollView style={styles.scrollView}>
        <HeaderHabit
          id={id}
          type="habit"
          setShowDeleteModal={setShowDeleteModal}
        />
        <View style={styles.page_content_container}>
          <Text style={styles.page_title}>{habit.title}</Text>
          <HabitStats habit={habit} />
          <HabitHistory habit={habit} setHabit={setHabit} />
          <TextBlock title="Description" text={habit.description} />
        </View>
      </ScrollView>

      {showDeleteModal && (
        <DeleteModal
          id={id}
          setShowModal={setShowDeleteModal}
          habit={habit}
          type="habit"
        />
      )}
    </>
  );
}
