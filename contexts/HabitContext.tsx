import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { EditHabitOrTaskForm, Habit } from "../types";
import {
  collection,
  getDocs,
  onSnapshot,
  where,
  query,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuthContext } from "./AuthContext";
import { calculateHowManyTimesDidAHabitHaveToBeDoneBetweenTwoDates } from "../utility";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editHabitOrTaskFormSchema } from "@/data";

type HabitContextType = {
  habits: Habit[];
  habitsCompletionsCount: number;
  habitsTimesToBeDone: number;
  editHabitForm: EditHabitOrTaskForm;
};

const defaultContext: HabitContextType = {
  habits: [],
  habitsCompletionsCount: 0,
  habitsTimesToBeDone: 0,
  editHabitForm: {} as EditHabitOrTaskForm,
};

const HabitContext = createContext<HabitContextType>(defaultContext);

const HabitContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const editHabitForm = useForm({
    resolver: yupResolver(editHabitOrTaskFormSchema),
  });

  const { user } = useAuthContext();
  const [habits, setHabits] = useState<Habit[]>(defaultContext.habits);
  const [habitsCompletionsCount, setHabitsCompletionsCount] =
    useState<number>(0);
  const [habitsTimesToBeDone, setHabitsTimesToBeDone] = useState<number>(0);

  const habitCollectionRef = collection(db, "habit");
  const q = useMemo(() => {
    return query(
      habitCollectionRef,
      where("userId", "==", user?.uid || "random_user_id")
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

    // Listen whenever there is an update for the habit collection
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

  return (
    <HabitContext.Provider
      value={{
        habits,
        habitsCompletionsCount,
        habitsTimesToBeDone,
        editHabitForm,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabitContext = () => useContext(HabitContext);

export default HabitContextProvider;
