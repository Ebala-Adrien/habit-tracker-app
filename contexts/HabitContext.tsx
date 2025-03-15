import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { EditHabitOrTaskForm, Habit } from '../types';
import {
  collection,
  getDocs,
  onSnapshot,
  where,
  query,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuthContext } from './AuthContext';
import { calculateHowManyTimesDidAHabitHaveToBeDoneBetweenTwoDates } from '../utility';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { editHabitOrTaskFormSchema } from '@/data';

type HabitContextType = {
  habits: Habit[];
  editHabitForm: EditHabitOrTaskForm;
  currentHabit: Habit | null;
  loading: boolean;
  error: string | null;
  date: Date;
  showDeleteModal: boolean;
  habitsCompletionsCount: number;
  habitsTimesToBeDone: number;
  loadHabit: (id: string) => Promise<void>;
  updateHabitCompletions: (habit: Habit) => Promise<void>;
  setDate: (date: Date) => void;
  setShowDeleteModal: (show: boolean) => void;
  setCurrentHabit: React.Dispatch<React.SetStateAction<Habit | null>>;
};

const defaultContext: HabitContextType = {
  habits: [],
  editHabitForm: {} as EditHabitOrTaskForm,
  currentHabit: null,
  loading: false,
  error: null,
  date: new Date(),
  showDeleteModal: false,
  habitsCompletionsCount: 0,
  habitsTimesToBeDone: 0,
  loadHabit: async () => {},
  updateHabitCompletions: async () => {},
  setDate: () => {},
  setShowDeleteModal: () => {},
  setCurrentHabit: () => {},
};

const HabitContext = createContext<HabitContextType>(defaultContext);

const HabitContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuthContext();
  const editHabitForm = useForm({
    resolver: yupResolver(editHabitOrTaskFormSchema),
  });

  const [habits, setHabits] = useState<Habit[]>([]);
  const [currentHabit, setCurrentHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [habitsCompletionsCount, setHabitsCompletionsCount] = useState(0);
  const [habitsTimesToBeDone, setHabitsTimesToBeDone] = useState(0);

  const habitCollectionRef = collection(db, 'habit');
  const q = useMemo(() => {
    return query(
      habitCollectionRef,
      where('userId', '==', user?.uid || 'random_user_id')
    );
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid) {
      getDocs(q)
        .then((querySnapshot) => {
          const docs = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Habit[];
          setHabits(docs);
        })
        .catch((e) => console.error(e.message));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Habit[];
      setHabits(docs);

      const currentDate = new Date().getTime();

      setHabitsTimesToBeDone(
        docs.reduce((acc, curr) => {
          const habitLastFrequencyUpdateTime = new Date(
            curr.lastFrequencyUpdate
          ).getTime();
          return (
            calculateHowManyTimesDidAHabitHaveToBeDoneBetweenTwoDates(
              curr,
              habitLastFrequencyUpdateTime,
              currentDate
            ) +
            curr.timesDoneBeforeFreqUpdate +
            acc
          );
        }, 0)
      );

      setHabitsCompletionsCount(
        docs.reduce((acc, curr) => acc + curr.habitCompletions.length, 0)
      );
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const loadHabit = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, 'habit', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCurrentHabit(docSnap.data() as Habit);
      } else {
        throw new Error("The doc doesn't exist");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateHabitCompletions = useCallback(async (habit: Habit) => {
    try {
      const docRef = doc(db, 'habit', habit.id);
      await updateDoc(docRef, {
        updatedAt: new Date(),
        habitCompletions: habit.habitCompletions,
      });
      setCurrentHabit(habit);
    } catch (error) {
      console.error("Couldn't update habit completions:", error);
    }
  }, []);

  return (
    <HabitContext.Provider
      value={{
        habits,
        editHabitForm,
        currentHabit,
        loading,
        error,
        date,
        showDeleteModal,
        habitsCompletionsCount,
        habitsTimesToBeDone,
        loadHabit,
        updateHabitCompletions,
        setDate,
        setShowDeleteModal,
        setCurrentHabit,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabitContext = () => useContext(HabitContext);

export default HabitContextProvider;
