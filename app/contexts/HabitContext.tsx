import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { Habit } from "../types";
import {
  collection,
  getDocs,
  onSnapshot,
  where,
  query,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuthContext } from "./AuthContext";
import { uniqueId } from "lodash";
import { calculateHowManyTimesDidAHabitHaveToBeDoneBetweenTwoDates } from "../utility";

type HabitContextType = {
  habits: Habit[];
  habitsCompletionsCount: number;
  habitsTimesToBeDone: number;
};

const defaultContext: HabitContextType = {
  habits: [],
  habitsCompletionsCount: 0,
  habitsTimesToBeDone: 0,
};

const HabitContext = createContext<HabitContextType>(defaultContext);

export const HabitContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuthContext();
  const [habits, setHabits] = useState<Habit[]>(defaultContext.habits);
  const [habitsCompletionsCount, setHabitsCompletionsCount] =
    useState<number>(0);
  const [habitsTimesToBeDone, setHabitsTimesToBeDone] = useState<number>(0);

  const habitCollectionRef = collection(db, "habit");
  const q = useMemo(() => {
    return query(
      habitCollectionRef,
      where("userId", "==", user?.uid || uniqueId("928937hh3793"))
    );
  }, [user?.uid]);

  const initialHabitStats = {
    numberOfHabits: 0,
  };

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
      // setHabitsTimesToBeDone(
      //   docs.reduce((acc, curr) => {
      //     const habitLastFrequencyUpdateTime = new Date(
      //       curr.lastFrequencyUpdate
      //     ).getTime();
      //     return (
      //       calculateHowManyTimesDidAHabitHaveToBeDoneBetweenTwoDates(
      //         curr,
      //         habitLastFrequencyUpdateTime,
      //         currentDate
      //       ) + acc
      //     );
      //   }, 0)
      // );

      // setHabitsCompletionsCount(
      //   docs.reduce((acc, curr) => acc + curr.habitCompletions.length, 0)
      // );
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return (
    <HabitContext.Provider
      value={{
        habits,
        habitsCompletionsCount,
        habitsTimesToBeDone,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabitContext = () => useContext(HabitContext);
