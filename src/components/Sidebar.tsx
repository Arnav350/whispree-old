import Search from "./Search";
import Users from "./Users";
import Slider from "./Slider";
import { UseChat } from "../reducers/ChatContext";
import { auth } from "../firebase";
import { UseAuth } from "../reducers/AuthContext";
import { signOut } from "firebase/auth";
import Logo from "../assets/Logo.png";
import "../App.css";

function Sidebar() {
  const currentUser = UseAuth();

  const { dispatch } = UseChat();

  function handleClick() {
    signOut(auth);
    dispatch({ type: "INIT" });
  }

  return (
    <div className="sidebar">
      <nav className="sidebar__nav">
        <h1 className="sidebar__logo">Whispree</h1>
        <div className="sidebar__profile">
          <img
            src={currentUser?.photoURL || Logo}
            alt="Temp"
            className="sidebar__avatar image"
          />
          <p className="sidebar__username">{currentUser?.displayName}</p>
        </div>
      </nav>
      <Search />
      <Users />
      <div className="sidebar__bottom">
        <Slider />
        <button className="sidebar__signout" onClick={handleClick}>
          Signout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
