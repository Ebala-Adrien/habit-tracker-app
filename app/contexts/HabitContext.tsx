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

type HabitContextType = {
  habits: Habit[];
};

const defaultContext: HabitContextType = {
  habits: [],
};

const HabitContext = createContext<HabitContextType>(defaultContext);

export const HabitContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuthContext();
  const [habits, setHabit] = useState<Habit[]>(defaultContext.habits);

  const habitCollectionRef = collection(db, "habit");
  const q = useMemo(() => {
    return query(
      habitCollectionRef,
      where(
        "user_id",
        "==",
        user?.uid || uniqueId("random_id_to_prevent_sending_undefined_value")
      )
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

          setHabit(docs);
        })
        .catch((e) => console.error(e.message));
    }

    // Listen whenever there is an update for the habit collection
    const unsubscribe = onSnapshot(habitCollectionRef, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Habit[];
      setHabit(docs);
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <HabitContext.Provider
      value={{
        habits,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabitContext = () => useContext(HabitContext);
