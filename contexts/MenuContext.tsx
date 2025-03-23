import CreateHabitOrTaskModal from "@/components/habitOrTask/modal/createHabitOrTaskModal";
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
  setShowCreateTaskOrHabitModal: (showFilter: boolean) => void;
  homeScreenDisplayFrequence: (typeof displayFrequencies)[number];
  setHomeScreenDisplayFrequence: (
    frequence: (typeof displayFrequencies)[number]
  ) => void;
};

const defaultContext: MenuContextType = {
  setShowCreateTaskOrHabitModal: () => {},
  homeScreenDisplayFrequence: "Day",
  setHomeScreenDisplayFrequence: () => {},
};

const MenuContext = createContext<MenuContextType>(defaultContext);

const MenuContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
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
