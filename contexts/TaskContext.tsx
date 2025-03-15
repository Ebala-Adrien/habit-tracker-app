import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuthContext } from './AuthContext';
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { EditHabitOrTaskForm, Task } from '@/types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { editHabitOrTaskFormSchema } from '@/data';

type TaskContextType = {
  tasks: Task[];
  editTaskForm: EditHabitOrTaskForm;
  tasksStats: {
    tasksCompleted: number;
    tasksCompletedOnTime: number;
    overdueTasks: number;
  };
};

const defaultContext: TaskContextType = {
  tasks: [],
  editTaskForm: {} as EditHabitOrTaskForm,
  tasksStats: {
    tasksCompleted: 0,
    tasksCompletedOnTime: 0,
    overdueTasks: 0,
  },
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
  const [archivedTasksCount, setArchivedTasksCount] = useState<number>(0);
  const [
    archivedTasksCompletedOnTimeCount,
    setArchivedTasksCompletedOnTimeCount,
  ] = useState<number>(0);

  const tasksStats = useMemo(() => {
    // Ongoing tasks that we should already have completed
    const overdueTasks = tasks.filter(
      (t) => new Date().getTime() > new Date(t.dueDate).getTime()
    ).length;

    return {
      tasksCompleted: archivedTasksCount,
      tasksCompletedOnTime:
        (archivedTasksCompletedOnTimeCount /
          (overdueTasks + archivedTasksCount)) *
        100, // %
      overdueTasks,
    };
  }, [tasks, archivedTasksCount, archivedTasksCompletedOnTimeCount]);

  const taskCollectionRef = collection(db, 'task');
  const tasksQuery = useMemo(() => {
    return query(
      taskCollectionRef,
      where('userId', '==', user?.uid || 'random_user_id')
    );
  }, [user?.uid]);

  const archivedTaskCollectionRef = collection(db, 'archivedTask');
  const archivedTaskQuery = useMemo(() => {
    return query(
      archivedTaskCollectionRef,
      where('userId', '==', user?.uid || 'random_user_id')
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

    const unsubscribeTasks = onSnapshot(tasksQuery, (querySnapshot) => {
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(docs);
    });

    const unsubscribeArchivedTasks = onSnapshot(
      archivedTaskQuery,
      (querySnapshot) => {
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Task[];

        setArchivedTasksCount(docs.length);
        setArchivedTasksCompletedOnTimeCount(
          docs.filter((t) => {
            if (!t.completedAt) return;
            return (
              new Date(t.dueDate).getTime() < new Date(t.completedAt).getTime()
            );
          }).length
        );
      }
    );

    return () => {
      unsubscribeTasks();
      unsubscribeArchivedTasks();
    };
  }, [user?.uid]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        editTaskForm,
        tasksStats,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);

export default TaskContextProvider;
