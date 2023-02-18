import React, { useState, useEffect, createContext } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

interface UserContext {
  currentUser: any;
  setCurrentUser: any;
}

interface AuthProviderChildren {
  children: React.ReactNode;
}

export const AuthContext = createContext({} as UserContext);

export const AuthProvider = ({ children }: AuthProviderChildren) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
