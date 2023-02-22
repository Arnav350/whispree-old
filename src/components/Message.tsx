import React, { useEffect, useRef } from "react";
import { UseAuth } from "../context/AuthContext";
import { UseChat } from "../context/ChatContext";
import { Timestamp } from "firebase/firestore";
import "../App.css";

function Message({ message }: any) {
  const currentUser = UseAuth();
  const { data } = UseChat();

  const messageClass = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    messageClass.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const messageDate = message.date.toDate().toString().substring(4, 15);
  const currentDate = Timestamp.now().toDate().toString().substring(4, 15);
  const messageTime = message.date.toDate().toString().substring(16, 21);

  return (
    <div
      className={`message ${message.senderUid === currentUser?.uid && "my"}`}
      ref={messageClass}
    >
      <div className="message__info">
        <img
          src={
            message.senderUid === currentUser?.uid
              ? currentUser?.photoURL
              : data.user.photoURL
          }
          alt=""
          className="message__avatar image"
        />
        <p className="message__time">
          {messageDate === currentDate ? messageTime : messageDate}
        </p>
      </div>
      <div className="message__content">
        {message.text && <p className="message__text">{message.text}</p>}
        {message.img && (
          <img src={message.img} alt="" className="message__image image" />
        )}
      </div>
    </div>
  );
}

export default Message;
