import CreateHabitOrTaskModal from "@/components/habit_or_task/modal/createHabitOrTaskModal";
import { usePathname } from "expo-router";
import React from "react";
import {
  createContext,
  ReactNode,
  useState,
  useContext,
  useEffect,
} from "react";

type MenuContextType = {
  showFilter: boolean;
  setShowFilter: (showFilter: boolean) => void;
  setShowCreateTaskOrHabitModal: (showFilter: boolean) => void;
};

const defaultContext: MenuContextType = {
  showFilter: false,
  setShowFilter: () => {},
  setShowCreateTaskOrHabitModal: () => {},
};

const MenuContext = createContext<MenuContextType>(defaultContext);

const MenuContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [showCreateTaskOrHabitModal, setShowCreateTaskOrHabitModal] =
    useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    if (showCreateTaskOrHabitModal) setShowCreateTaskOrHabitModal(false);
  }, [pathname]);

  return (
    <MenuContext.Provider
      value={{
        showFilter,
        setShowFilter,
        setShowCreateTaskOrHabitModal,
      }}
    >
      {children}
      {showCreateTaskOrHabitModal && <CreateHabitOrTaskModal />}
    </MenuContext.Provider>
  );
};

export const useMenuContext = () => useContext(MenuContext);

export default MenuContextProvider;
