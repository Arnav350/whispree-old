import { useState, useEffect, createContext } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser]: any = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);
};
