import React, { useState, useEffect } from "react";
import Message from "./Message";
import { db } from "../firebase";
import { UseUser } from "../context/UserContext";
import { doc, onSnapshot } from "firebase/firestore";
import { RiImageAddFill, RiAttachment2 } from "react-icons/ri";

function Chat() {
  const { data } = UseUser();

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatUid), (doc: any) => {
      doc.exists() && setMessages(doc.data());
    });

    return () => {
      unSub();
    };
  }, [data.chatUid]);

  return (
    <div className="chat">
      <nav className="chat__info">
        <p className="chat__username">{data.user?.displayName}</p>
      </nav>
      <div className="chat__messages">
        {messages.map((message) => (
          <Message message={message} />
        ))}
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
