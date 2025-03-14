import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { Habit } from '@/types';

export function useHabit(id: string) {
  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const docRef = doc(db, 'habit', id);

  useEffect(() => {
    const fetchHabit = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHabit(docSnap.data() as Habit);
        } else {
          throw new Error("The doc doesn't exist");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHabit();
  }, [id]);

  useEffect(() => {
    const updateHabitCompletions = async () => {
      if (!habit?.habitCompletions) return;

      try {
        await updateDoc(docRef, {
          updatedAt: new Date(),
          habitCompletions: habit.habitCompletions,
        });
      } catch (error) {
        console.error("Couldn't update habit completions:", error);
      }
    };

    updateHabitCompletions();
  }, [habit?.habitCompletions, id]);

  return { habit, setHabit, loading, error };
}
