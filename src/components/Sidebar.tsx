import React from "react";
import Users from "./Users";

function Sidebar() {
  return (
    <div className="sidebar">
      <nav className="sidebar__nav">
        <h1 className="sidebar__logo">AnySpeak</h1>
        <button className="sidebar__profile">
          <img src="" alt="Temp" className="sidebar__avatar" />
          <h3 className="sidebar__username">Awesome</h3>
        </button>
      </nav>
      <input
        type="text"
        placeholder="Find a User..."
        className="sidebar__search"
      />
      <Users />
    </div>
  );
}

export default Sidebar;
