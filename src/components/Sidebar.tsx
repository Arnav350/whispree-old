import React from "react";
import Search from "./Search";
import Slider from "./Slider";
import { auth } from "../firebase";
import { UseAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import Users from "./Users";
import "../App.css";

function Sidebar() {
  const currentUser = UseAuth();

  return (
    <div className="sidebar">
      <div className="sidebar__main">
        <nav className="sidebar__nav">
          <h1 className="sidebar__logo">AnySpeak</h1>
          <div className="sidebar__profile">
            <img
              src={currentUser?.photoURL || ""}
              alt="Temp"
              className="sidebar__avatar image"
            />
            <h3 className="sidebar__username">{currentUser?.displayName}</h3>
          </div>
        </nav>
        <Search />
        <Users />
      </div>
      <div className="sidebar__bottom">
        <Slider />
        <button className="sidebar__signout" onClick={() => signOut(auth)}>
          Signout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
