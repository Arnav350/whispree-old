import React, { useState, useEffect } from "react";
import Message from "./Message";
import { db, storage } from "../firebase";
import { UseAuth } from "../reducers/AuthContext";
import { UseChat } from "../reducers/ChatContext";
import {
  arrayUnion,
  doc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { RiImageAddFill, RiAttachment2 } from "react-icons/ri";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
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
    const unSub = onSnapshot(doc(db, "chats", data.chatUid), (doc: any) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatUid]);

  async function handleSend(e: any) {
    e.preventDefault();

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
        (error: any) => {},
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
      if (text) {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [data.chatUid + ".lastMessage"]: {
            text,
          },
          [data.chatUid + ".date"]: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [data.chatUid + ".lastMessage"]: {
            text: "Attachment: 1",
          },
          [data.chatUid + ".date"]: serverTimestamp(),
        });
      }
    }

    if (text) {
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatUid + ".lastMessage"]: {
          text,
        },
        [data.chatUid + ".date"]: serverTimestamp(),
      });
    } else {
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatUid + ".lastMessage"]: {
          text: "Attachment: 1",
        },
        [data.chatUid + ".date"]: serverTimestamp(),
      });
    }

    setText("");
    setImg(null);
  }

  return (
    <div className="chat">
      <nav className="chat__info">
        <p className="chat__username">{data.user?.displayName}</p>
      </nav>
      <div className="chat__messages">
        {messages.map((message: IMessage, index: number) => (
          <Message message={message} key={messages[index].id} />
        ))}
      </div>
      <form className="chat__input" onSubmit={handleSend}>
        <input
          type="text"
          value={text}
          placeholder="Type Something..."
          className="chat__text"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setText(event.target.value)
          }
        />
        <div className="chat__options">
          <RiAttachment2 className="chat__attach click" />
          <input
            type="file"
            id="chat__image"
            className="chat__image"
            onChange={(event: any) => setImg(event.target.files[0])}
          />
          <label htmlFor="chat__image">
            <RiImageAddFill className="chat__attach click" />
          </label>
          <input type="submit" value="Send" className="chat__send" />
        </div>
      </form>
    </div>
  );
}

export default Chat;
