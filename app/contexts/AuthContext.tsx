import { auth } from "@/firebaseConfig";
import { User } from "firebase/auth";
import { useRouter } from "expo-router";
import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

type AuthContextType = {
  user: User | null;
  authCtxIsLoading: boolean;
  setAuthCtxIsLoading: Dispatch<React.SetStateAction<boolean>>;
};

const defaultContext: AuthContextType = {
  user: null,
  authCtxIsLoading: true,
  setAuthCtxIsLoading: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [authCtxIsLoading, setAuthCtxIsLoading] = useState<boolean>(
    defaultContext.authCtxIsLoading
  );

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        router.push("/(tabs)");
      } else {
        setUser(null);
        router.push("/login");
      }
      setAuthCtxIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authCtxIsLoading,
        setAuthCtxIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);