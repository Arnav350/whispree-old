import React, { useState, useEffect } from "react";
import Message from "./Message";
import { UseAuth } from "../reducers/AuthContext";
import { UseChat } from "../reducers/ChatContext";
import { db, storage } from "../firebase";
import {
  arrayUnion,
  doc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { RiImageAddFill, RiCloseCircleFill } from "react-icons/ri";
import "../App.css";

interface IMessage {
  id: string;
  text?: string;
  senderUid: string;
  date: Timestamp;
  img?: string;
}

type IMessages = IMessage[];

function Chat() {
  const currentUser = UseAuth();
  const { data } = UseChat();

  const [text, setText] = useState<string>("");
  const [img, setImg] = useState<File | null>(null);

  const [messages, setMessages] = useState<IMessages | []>([]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatUid), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatUid]);

  async function handleSend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {},
        () => {
          if (text) {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL: string) => {
                await updateDoc(doc(db, "chats", data.chatUid), {
                  messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderUid: currentUser?.uid,
                    date: Timestamp.now(),
                    img: downloadURL,
                  }),
                });
              }
            );
          } else {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL: string) => {
                await updateDoc(doc(db, "chats", data.chatUid), {
                  messages: arrayUnion({
                    id: uuid(),
                    senderUid: currentUser?.uid,
                    date: Timestamp.now(),
                    img: downloadURL,
                  }),
                });
              }
            );
          }
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatUid), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderUid: currentUser?.uid,
          date: Timestamp.now(),
        }),
      });
    }

    if (currentUser) {
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatUid + ".lastMessage"]: {
          text: text || "Attachment: 1",
        },
        [data.chatUid + ".date"]: serverTimestamp(),
      });
    }
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatUid + ".lastMessage"]: {
        text: text || "Attachment: 1",
      },
      [data.chatUid + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  }

  return (
    <div className="chat">
      <nav className="chat__info">
        {data.user.photoURL && (
          <img
            src={data.user.photoURL}
            alt="avatar"
            className="chat__avatar image"
          />
        )}
        <p className="chat__username">{data.user.displayName}</p>
      </nav>
      <div className="chat__messages">
        {messages.map((message: IMessage, index: number) => (
          <Message message={message} key={messages[index].id} />
        ))}
      </div>
      {img && (
        <figure className="chat__preview">
          <img
            src={URL.createObjectURL(img)}
            alt="Preview"
            className="chat__img image"
          />
          <RiCloseCircleFill
            className="chat__close"
            onClick={() => setImg(null)}
          />
        </figure>
      )}
      <form className="chat__input" onSubmit={handleSend}>
        <input
          type="text"
          value={text}
          placeholder={
            Object.keys(data.user).length ? "Send a message" : "Click on a user"
          }
          readOnly={Object.keys(data.user).length ? false : true}
          className="chat__text"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setText(event.target.value)
          }
        />
        <div className="chat__options">
          <input
            type="file"
            accept="image/*"
            id="chat__image"
            className="chat__image"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setImg(event.target.files ? event.target.files[0] : null)
            }
          />
          <label htmlFor="chat__image" className="chat__attach">
            <RiImageAddFill className="chat__add click" />
          </label>
          <input type="submit" value="Send" className="chat__send" />
        </div>
      </form>
    </div>
  );
}

export default Chat;
