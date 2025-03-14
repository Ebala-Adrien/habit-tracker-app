import { ReactNode } from 'react';
import AuthContextProvider from './AuthContext';
import MenuContextProvider from './MenuContext';
import HabitContextProvider from './HabitContext';
import TaskContextProvider from './TaskContext';
import Toast from 'react-native-toast-message';
import ToastConfig from '@/data/ToastConfig';

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthContextProvider>
      <MenuContextProvider>
        <HabitContextProvider>
          <TaskContextProvider>
            {children}
            <Toast config={ToastConfig} />
          </TaskContextProvider>
        </HabitContextProvider>
      </MenuContextProvider>
    </AuthContextProvider>
  );
}
