import React, { createContext, useContext, useState, ReactNode } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../supabase";

interface AuthContextType {
  session: Session | null;
  setSession: (session: Session | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out: ", error);
    }
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, setSession, logout }}>
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
