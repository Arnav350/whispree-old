import React, { createContext, useContext, useReducer } from "react";
import { auth } from "../firebase";
import { UseAuth } from "./AuthContext";
import { User } from "firebase/auth";

interface IProviderChildren {
  children: React.ReactNode;
}

export const UserContext = createContext<any>(null);

export function UserProvider({ children }: IProviderChildren) {
  const currentUser = UseAuth();

  const INIT_STATE = {
    chatUid: "null",
    user: {},
  };

  const chatReducer = (state: any, action: any) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatUid: currentUser
            ? currentUser?.uid > action.payload.uid
              ? currentUser?.uid + action.payload.uid
              : action.payload.uid + currentUser?.uid
            : "",
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INIT_STATE);

  return (
    <UserContext.Provider value={{ data: state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export const UseUser = () => useContext<any | null>(UserContext);
