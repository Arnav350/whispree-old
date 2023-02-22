import React, { createContext, useContext, useReducer } from "react";
import { UseAuth } from "./AuthContext";

interface IProviderChildren {
  children: React.ReactNode;
}

export const ChatContext = createContext<any>(null);

export function ChatProvider({ children }: IProviderChildren) {
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
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
}

export const UseChat = () => useContext<any | null>(ChatContext);
