import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { UseAuth } from "../context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { User } from "firebase/auth";

function Users() {
  const currentUser: User | null = UseAuth();

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
  }, [currentUser?.uid]);

  return (
    <div className="user__container">
      <div className="user">
        <img src="" alt="Temp" className="user__avatar" />
        <div className="user__info">
          <p className="user__username">Arnav</p>
          <p className="user__message">Hello there!</p>
        </div>
      </div>
      <div className="user">
        <img src="" alt="Temp" className="user__avatar" />
        <div className="user__info">
          <p className="user__username">Arnav</p>
          <p className="user__message">Hello there!</p>
        </div>
      </div>
      <div className="user">
        <img src="" alt="Temp" className="user__avatar" />
        <div className="user__info">
          <p className="user__username">Arnav</p>
          <p className="user__message">Hello there!</p>
        </div>
      </div>
      <div className="user">
        <img src="" alt="Temp" className="user__avatar" />
        <div className="user__info">
          <p className="user__username">Arnav</p>
          <p className="user__message">Hello there!</p>
        </div>
      </div>
    </div>
  );
}

export default Users;
