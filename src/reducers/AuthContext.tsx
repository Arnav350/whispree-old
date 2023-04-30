import React, { useState, useEffect, createContext, useContext } from "react";
import { auth } from "../firebase";
import { User } from "firebase/auth";

interface IProviderChildren {
  children: React.ReactNode;
}

export const AuthContext = createContext<User | null>(null);

export function AuthProvider({ children }: IProviderChildren) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
  );
}

export const UseAuth = () => useContext<User | null>(AuthContext);
