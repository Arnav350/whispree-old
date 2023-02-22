import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { UseAuth } from "../context/AuthContext";
import { UseChat } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { User } from "firebase/auth";
import "../App.css";

interface IUserInfo {
  displayName: string;
  photoURL: string;
  uid: string;
}

function Users() {
  const currentUser: User | null = UseAuth();
  const { dispatch } = UseChat();

  const [users, setUsers] = useState<any | []>([]);

  useEffect(() => {
    function getUsers() {
      if (currentUser) {
        const unsub = onSnapshot(
          doc(db, "userChats", currentUser.uid),
          (doc) => {
            setUsers(doc.data());
          }
        );

        return () => {
          unsub();
        };
      }
    }

    currentUser?.uid && getUsers();
  }, [currentUser?.uid, currentUser]);

  function handleSelect(userInfo: IUserInfo) {
    dispatch({ type: "CHANGE_USER", payload: userInfo });
  }

  return (
    <div className="user__container">
      {Object.entries(users)
        ?.sort((a: any, b: any) => b[1].date - a[1].date)
        .map((chat: any) => (
          <div
            className="user"
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}
          >
            <img
              src={chat[1].userInfo.photoURL}
              alt="Temp"
              className="user__avatar image"
            />
            <div className="user__info">
              <p className="user__username">{chat[1].userInfo.displayName}</p>
              <p className="user__message">{chat[1].lastMessage?.text}</p>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Users;
