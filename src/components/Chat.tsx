import React, { useState, useEffect } from "react";
import Message from "./Message";
import { db, storage } from "../firebase";
import { UseAuth } from "../context/AuthContext";
import { UseUser } from "../context/UserContext";
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

function Chat() {
  const currentUser = UseAuth();
  const { data } = UseUser();

  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const [messages, setMessages] = useState<any | []>([]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatUid), (doc: any) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatUid]);

  async function handleSend() {
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
              async (downloadURL: any) => {
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
              async (downloadURL: any) => {
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
        {messages.map((message: any, index: number) => (
          <Message message={message} key={messages[index].id} />
        ))}
      </div>
      <div className="chat__input">
        <input
          type="text"
          value={text}
          placeholder="Type Something..."
          className="chat__text"
          onChange={(event: any) => setText(event.target.value)}
        />
        <div className="chat__options">
          <RiAttachment2 className="chat__attach" />
          <input
            type="file"
            id="chat__image"
            className="chat__image"
            onChange={(event: any) => setImg(event.target.files[0])}
          />
          <label htmlFor="chat__image">
            <RiImageAddFill className="chat__attach" />
          </label>
          <button className="chat__send" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
