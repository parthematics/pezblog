import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { type Session } from "@supabase/supabase-js";
import { logout } from "../supabase";

interface AuthContextType {
  session: Session | null;
  setSession: (session: Session | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(() => {
    const savedSession = localStorage.getItem("session");
    return savedSession ? JSON.parse(savedSession) : null;
  });

  useEffect(() => {
    if (session) {
      localStorage.setItem("session", JSON.stringify(session));
    } else {
      localStorage.removeItem("session");
    }
  }, [session]);

  const signOut = async () => {
    const { error } = await logout();
    if (error) {
      console.error("Error logging out: ", error);
    }
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, setSession, logout: signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
