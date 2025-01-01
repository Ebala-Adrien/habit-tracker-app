import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuthContext } from "./AuthContext";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { EditHabitOrTaskForm, Task } from "@/types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editHabitOrTaskFormSchema } from "@/data";

type TaskContextType = {
  tasks: Task[];
  editTaskForm: EditHabitOrTaskForm;
};

const defaultContext: TaskContextType = {
  tasks: [],
  editTaskForm: {} as EditHabitOrTaskForm,
};

const TaskContext = createContext<TaskContextType>(defaultContext);

const TaskContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuthContext();

  const editTaskForm = useForm({
    resolver: yupResolver(editHabitOrTaskFormSchema),
  });

  const [tasks, setTasks] = useState<Task[]>([]);

  const taskCollectionRef = collection(db, "task");
  const tasksQuery = useMemo(() => {
    return query(
      taskCollectionRef,
      where("userId", "==", user?.uid || "random_user_id")
    );
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid) {
      getDocs(tasksQuery)
        .then((querySnapshot) => {
          const docs = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Task[];
          setTasks(docs);
        })
        .catch((e) => {
          console.error(e);
        });
    }

    const unsubscribe = onSnapshot(tasksQuery, (querySnapshot) => {
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(docs);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        editTaskForm,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);

export default TaskContextProvider;
