import React, { useState } from "react";
import { auth, db, storage } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { RiImageAddFill } from "react-icons/ri";
import "../App.css";

function SignUp() {
  const [err, setErr] = useState<boolean>(false);
  const [file, setFile] = useState<string>("");
  const navigate = useNavigate();

  async function handleSubmit(event: any) {
    event.preventDefault();

    const username = event.target[0].value;
    const email = event.target[1].value;
    const password = event.target[2].value;
    const confirm = event.target[3].value;
    const avatar = event.target[4].files[0];

    if (password !== confirm) {
      setErr(true);
      return null;
    }
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, username);

      const uploadTask = uploadBytesResumable(storageRef, avatar);

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
        (error: any) => {
          setErr(true);
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(res.user, {
              displayName: username,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName: username,
              email,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          });
        }
      );
    } catch (error) {
      setErr(true);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) setFile(URL.createObjectURL(event.target.files[0]));
  }

  return (
    <div className="sign__container">
      <div className="sign">
        <h1 className="sign__title">Sign Up</h1>
        <h3 className="sign__logo">AnySpeak</h3>
        {err && <p>There was an error</p>}
        <form className="sign__form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" className="sign__input" />
          <input type="email" placeholder="Email" className="sign__input" />
          <input
            type="password"
            placeholder="Password"
            className="sign__input"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="sign__input"
          />
          <input
            type="file"
            id="sign__avatar"
            className="sign__avatar"
            onChange={handleChange}
          />
          <label htmlFor="sign__avatar" className="sign__label">
            <div className="sign__attach">
              <RiImageAddFill className="sign__icon" />
              <p className="sign__add">Add an avatar</p>
            </div>
            {file && <img src={file} alt="" className="sign__file" />}
          </label>
          <input type="submit" value="Sign Up" className="sign__submit" />
        </form>
        <p className="sign__para">
          Already have an account?{" "}
          <Link to="/signin" className="sign__sign">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
