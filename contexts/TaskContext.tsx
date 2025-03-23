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
  onSnapshot,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { EditHabitOrTaskForm, Task } from "@/types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editHabitOrTaskFormSchema } from "@/data";

interface TaskInsights {
  oldestTask: {
    name: string;
    createdDays: number;
  } | null;
  mostOverdue: {
    name: string;
    overdueDays: number;
    dueDate: string;
  } | null;
}

type TaskContextType = {
  tasks: Task[];
  editTaskForm: EditHabitOrTaskForm;
  tasksStats: {
    tasksCompleted: number;
    tasksCompletedOnTime: number;
    overdueTasks: number;
  };
  taskInsights: TaskInsights;
  toggleTaskCompletion: (task: Task) => Promise<void>;
  loadingTasks: boolean;
};

const defaultContext: TaskContextType = {
  tasks: [],
  editTaskForm: {} as EditHabitOrTaskForm,
  tasksStats: {
    tasksCompleted: 0,
    tasksCompletedOnTime: 0,
    overdueTasks: 0,
  },
  taskInsights: {
    oldestTask: null,
    mostOverdue: null,
  },
  toggleTaskCompletion: async () => {},
  loadingTasks: false,
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
  const [loadingTasks, setLoadingTasks] = useState(false);

  // Function to toggle task completion status
  const toggleTaskCompletion = async (task: Task) => {
    try {
      const taskRef = doc(db, "task", task.id);
      const now = new Date().toUTCString();

      await updateDoc(taskRef, {
        completed: !task.completed,
        updatedAt: now,
        completedAt: !task.completed ? now : null,
      });
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  const tasksStats = useMemo(() => {
    const completedTasks = tasks.filter((t) => t.completed);
    const overdueTasks = tasks.filter(
      (t) =>
        !t.completed && new Date().getTime() > new Date(t.dueDate).getTime()
    ).length;

    const completedOnTime = completedTasks.filter((t) => {
      if (!t.completedAt) return false;
      return new Date(t.completedAt).getTime() <= new Date(t.dueDate).getTime();
    }).length;

    return {
      tasksCompleted: completedTasks.length,
      tasksCompletedOnTime:
        completedTasks.length > 0
          ? (completedOnTime / (overdueTasks + completedTasks.length)) * 100
          : 0,
      overdueTasks,
    };
  }, [tasks]);

  const taskInsights = useMemo(() => {
    const now = new Date();
    const incompleteTasks = tasks.filter((t) => !t.completed);

    // Find oldest task based on creation date
    const oldestTask = incompleteTasks.reduce((oldest, current) => {
      if (!oldest) return current;
      return new Date(current.createdAt) < new Date(oldest.createdAt)
        ? current
        : oldest;
    }, null as Task | null);

    // Find most overdue task
    const overdueTasks = incompleteTasks.filter(
      (t) => new Date(t.dueDate) < now
    );
    const mostOverdueTask = overdueTasks.reduce((most, current) => {
      if (!most) return current;
      return new Date(current.dueDate) < new Date(most.dueDate)
        ? current
        : most;
    }, null as Task | null);

    return {
      oldestTask: oldestTask
        ? {
            name: oldestTask.title,
            createdDays: Math.floor(
              (now.getTime() - new Date(oldestTask.createdAt).getTime()) /
                (1000 * 60 * 60 * 24)
            ),
          }
        : null,
      mostOverdue: mostOverdueTask
        ? {
            name: mostOverdueTask.title,
            overdueDays: Math.floor(
              (now.getTime() - new Date(mostOverdueTask.dueDate).getTime()) /
                (1000 * 60 * 60 * 24)
            ),
            dueDate: mostOverdueTask.dueDate,
          }
        : null,
    };
  }, [tasks]);

  const taskCollectionRef = collection(db, "task");
  const tasksQuery = useMemo(() => {
    return query(
      taskCollectionRef,
      where("userId", "==", user?.uid || "random_user_id")
    );
  }, [user?.uid]);

  useEffect(() => {
    setLoadingTasks(true);
    const unsubscribeTasks = onSnapshot(tasksQuery, (querySnapshot) => {
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(docs);
      setLoadingTasks(false);
    });

    return () => {
      unsubscribeTasks();
    };
  }, [user?.uid]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        editTaskForm,
        tasksStats,
        taskInsights,
        toggleTaskCompletion,
        loadingTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);

export default TaskContextProvider;
