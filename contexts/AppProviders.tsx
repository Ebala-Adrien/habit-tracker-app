import { ReactNode } from "react";
import AuthContextProvider from "./AuthContext";
import MenuContextProvider from "./MenuContext";
import HabitContextProvider from "./HabitContext";
import TaskContextProvider from "./TaskContext";

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthContextProvider>
      <MenuContextProvider>
        <HabitContextProvider>
          <TaskContextProvider>{children}</TaskContextProvider>
        </HabitContextProvider>
      </MenuContextProvider>
    </AuthContextProvider>
  );
}
