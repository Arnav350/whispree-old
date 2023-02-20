import React, { useState, useEffect, createContext, useContext } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface IAuthProviderChildren {
  children: React.ReactNode;
}

export const AuthContext = createContext<User | null>(null);

export function AuthProvider({ children }: IAuthProviderChildren) {
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
