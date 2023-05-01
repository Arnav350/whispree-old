import React, { createContext, useContext, useReducer } from "react";
import { UseAuth } from "./AuthContext";

interface IProviderChildren {
  children: React.ReactNode;
}

interface IAction {
  payload: {
    uid: string;
  };
  type: string;
}

interface IState {
  chatUid: string;
  user: {
    displayName?: string;
    photoURL?: string;
    uid?: string;
  };
}

interface IContext {
  data: IState;
  dispatch: React.Dispatch<IAction>;
}

export const ChatContext = createContext<IContext | null>(null);

export function ChatProvider({ children }: IProviderChildren) {
  const currentUser = UseAuth();

  const INIT_STATE: IState = {
    chatUid: "null",
    user: {},
  };

  const chatReducer = (state: IState, action: IAction) => {
    switch (action.type) {
      case "CHANGE_USER":
        console.log(state);
        return {
          chatUid: currentUser
            ? currentUser?.uid > action.payload.uid
              ? currentUser?.uid + action.payload.uid
              : action.payload.uid + currentUser?.uid
            : "",
          user: action.payload,
        };
      case "INIT":
        return {
          chatUid: "null",
          user: {},
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
