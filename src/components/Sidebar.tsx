import React, { useState } from "react";
import { auth } from "../firebase";
import { UseAuth } from "../context/AuthContext";
import Search from "./Search";
import { signOut } from "firebase/auth";
import Users from "./Users";

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
              className="sidebar__avatar"
            />
            <h3 className="sidebar__username">{currentUser?.displayName}</h3>
          </div>
        </nav>
        <Search />
        <Users />
      </div>
      <div className="sidebar__bottom">
        <button className="sidebar__logout" onClick={() => signOut(auth)}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
