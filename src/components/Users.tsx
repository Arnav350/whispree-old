import { useEffect, useState } from "react";
import { db } from "../firebase";
import { UseAuth } from "../reducers/AuthContext";
import { UseChat } from "../reducers/ChatContext";
import { doc, DocumentData, onSnapshot, Timestamp } from "firebase/firestore";
import { User } from "firebase/auth";
import "../App.css";

interface IUserInfo {
  displayName: string;
  photoURL: string;
  uid: string;
}

type IUser = [
  string,
  {
    date: Timestamp;
    lastMessage: {
      text: string;
    };
    userInfo: {
      displayName: string;
      photoURL: string;
      uid: string;
    };
  }
];

function Users() {
  const currentUser: User | null = UseAuth();
  const { dispatch } = UseChat();

  const [users, setUsers] = useState<DocumentData | undefined>(undefined);

  const currentDate = Timestamp.now().toDate().toString().substring(4, 10);

  useEffect(() => {
    if (currentUser) {
      const unSub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setUsers(doc.data());
      });

      return () => {
        unSub();
      };
    }
  }, [currentUser?.uid, currentUser]);

  function handleSelect(userInfo: IUserInfo) {
    dispatch({ type: "CHANGE_USER", payload: userInfo });
  }

  return (
    <div className="user__container">
      {users &&
        Object.entries(users)
          ?.sort((a: IUser, b: IUser) => b[1].date.seconds - a[1].date.seconds)
          .map((chat: IUser) => (
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
                <div className="user__row">
                  <p className="user__username">
                    {chat[1].userInfo.displayName}
                  </p>
                  {chat[1].date && (
                    <p className="user__time">
                      {chat[1].date.toDate().toString().substring(4, 10) ===
                      currentDate
                        ? chat[1].date.toDate().toString().substring(16, 21)
                        : chat[1].date.toDate().toString().substring(4, 10)}
                    </p>
                  )}
                </div>
                <p className="user__message">{chat[1].lastMessage?.text}</p>
              </div>
            </div>
          ))}
    </div>
  );
}

export default Users;
