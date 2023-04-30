import React, { useState } from "react";
import { db } from "../firebase";
import { UseAuth } from "../reducers/AuthContext";
import {
  collection,
  query,
  where,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { User } from "firebase/auth";
import "../App.css";

function Search() {
  const currentUser: User | null = UseAuth();

  const [username, setUsername] = useState<string>("");
  const [user, setUser] = useState<any | null>(null);
  const [err, setErr] = useState<boolean>(false);

  async function handleSearch() {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (error) {
      setErr(true);
    }
  }

  async function handleSelect() {
    const combinedUid: string = currentUser
      ? currentUser?.uid > user.uid
        ? currentUser?.uid + user.uid
        : user.uid + currentUser?.uid
      : "";

    try {
      const res: any = await getDoc(doc(db, "chats", combinedUid));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedUid), { messages: [] });

        if (currentUser && user) {
          await updateDoc(doc(db, "userChats", currentUser.uid), {
            [combinedUid + ".userInfo"]: {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            [combinedUid + ".date"]: serverTimestamp(),
          });

          await updateDoc(doc(db, "userChats", user.uid), {
            [combinedUid + ".userInfo"]: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            },
            [combinedUid + ".date"]: serverTimestamp(),
          });
        }
      }
    } catch (error) {
      setErr(true);
    }

    setUser(null);
    setUsername("");
  }

  return (
    <div className="sidebar__search">
      <input
        type="text"
        value={username}
        placeholder="Find a User..."
        className="sidebar__input"
        onChange={(event) => setUsername(event.target.value)}
        onKeyDown={(event): any => {
          event.code === "Enter" && handleSearch();
        }}
      />
      {err && <p>User not found!</p>}
      {user && (
        <div className="user" onClick={handleSelect}>
          <img
            src={user?.photoURL || ""}
            alt="Temp"
            className="user__avatar image"
          />
          <div className="user__info">
            <p className="user__username">{user?.displayName}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
