import { useState } from "react";
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
import { RiSearchLine, RiUserAddLine } from "react-icons/ri";
import "../App.css";

// interface IUser {
//   displayName: string;
//   email: string;
//   photoURL: string;
//   uid: string;
// }

function Search() {
  const currentUser: User | null = UseAuth();

  const [username, setUsername] = useState<string>("");
  const [user, setUser] = useState<any | null>(null);
  const [err, setErr] = useState<boolean>(false);

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

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
      const res = await getDoc(doc(db, "chats", combinedUid));

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
      <form className="sidebar__bar" onSubmit={handleSearch}>
        <RiSearchLine className="sidebar__magnify" />
        <input
          type="text"
          value={username}
          placeholder="Find a User..."
          className="sidebar__input"
          onChange={(event) => setUsername(event.target.value)}
        />
        {username && (
          <label htmlFor="sidebar__submit" className="sidebar__label">
            <RiUserAddLine className="sidebar__add click" />
          </label>
        )}
        <input type="submit" id="sidebar__submit" className="sidebar__submit" />
      </form>
      {err && <p>User not found!</p>}
      {user && (
        <div className="user" onClick={handleSelect}>
          <img src={user.photoURL} alt="Avatar" className="user__avatar" />
          <div className="user__info">
            <p className="user__username">{user.displayName}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
