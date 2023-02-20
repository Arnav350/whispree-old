import React from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import Users from "./Users";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar__main">
        <nav className="sidebar__nav">
          <h1 className="sidebar__logo">AnySpeak</h1>
          <div className="sidebar__profile">
            <img src="" alt="Temp" className="sidebar__avatar" />
            <h3 className="sidebar__username">Awesome</h3>
          </div>
        </nav>
        <input
          type="text"
          placeholder="Find a User..."
          className="sidebar__search"
        />
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
