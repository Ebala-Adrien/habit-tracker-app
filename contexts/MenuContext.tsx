import CreateHabitOrTaskModal from "@/components/habit_or_task/modal/createHabitOrTaskModal";
import { displayFrequencies, filterArray } from "@/data";
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
  homeScreenDisplayFrequence: (typeof displayFrequencies)[number];
  setHomeScreenDisplayFrequence: (
    frequence: (typeof displayFrequencies)[number]
  ) => void;
  setFilter: (filter: typeof filterArray) => void;
  filter: typeof filterArray;
};

const defaultContext: MenuContextType = {
  showFilter: false,
  setShowFilter: () => {},
  setFilter: () => {},
  filter: filterArray,
  setShowCreateTaskOrHabitModal: () => {},
  homeScreenDisplayFrequence: "Day",
  setHomeScreenDisplayFrequence: () => {},
};

const MenuContext = createContext<MenuContextType>(defaultContext);

const MenuContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<typeof filterArray>(filterArray);
  const [showCreateTaskOrHabitModal, setShowCreateTaskOrHabitModal] =
    useState<boolean>(false);
  const pathname = usePathname();
  const [homeScreenDisplayFrequence, setHomeScreenDisplayFrequence] = useState<
    (typeof displayFrequencies)[number]
  >(displayFrequencies[0]);

  useEffect(() => {
    if (showCreateTaskOrHabitModal) setShowCreateTaskOrHabitModal(false);
  }, [pathname]);

  return (
    <MenuContext.Provider
      value={{
        showFilter,
        setShowFilter,
        filter,
        setFilter,
        setShowCreateTaskOrHabitModal,
        homeScreenDisplayFrequence,
        setHomeScreenDisplayFrequence,
      }}
    >
      {children}
      {showCreateTaskOrHabitModal && <CreateHabitOrTaskModal />}
    </MenuContext.Provider>
  );
};

export const useMenuContext = () => useContext(MenuContext);

export default MenuContextProvider;
