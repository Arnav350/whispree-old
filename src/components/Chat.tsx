import React from "react";
import Message from "./Message";
import { RiImageAddFill, RiAttachment2 } from "react-icons/ri";

function Chat() {
  return (
    <div className="chat">
      <nav className="chat__info">
        <p className="chat__username">Arnav</p>
      </nav>
      <div className="chat__messages">
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
      </div>
      <div className="chat__input">
        <input
          type="text"
          placeholder="Type Something..."
          className="chat__text"
        />
        <div className="chat__options">
          <RiAttachment2 className="chat__attach" />
          <input type="file" id="chat__image" className="chat__image" />
          <label htmlFor="chat__image">
            <RiImageAddFill className="chat__attach" />
          </label>
          <button className="chat__send">Send</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
