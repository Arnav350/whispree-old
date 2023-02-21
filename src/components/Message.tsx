import React from "react";

function Message({ message }: any) {
  return (
    <div className="my message">
      <div className="message__info">
        <img
          src="https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png"
          alt=""
          className="message__avatar"
        />
        <p className="message__time">just now</p>
      </div>
      <div className="message__content">
        <p className="message__text">hello</p>
        <img
          src="https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png"
          alt=""
          className="message__image"
        />
      </div>
    </div>
  );
}

export default Message;
