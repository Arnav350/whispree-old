import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { RiImageAddFill } from "react-icons/ri";
import "../App.css";

function SignUp() {
  const [err, setErr] = useState(false);
  async function handleSubmit(event: any) {
    event.preventDefault();

    const username = event.target[0].value;
    const email = event.target[1].value;
    const password = event.target[2].value;
    const avatar = event.target[4].files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, username);

      const uploadTask = uploadBytesResumable(storageRef, avatar);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("File available at", downloadURL);
            await updateProfile(res.user, {
              displayName: username,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "users", res.user.uid), {
              displayName: username,
              email,
              photoURL: downloadURL,
              uid: res.user.uid,
            });
          });
        }
      );
    } catch (err) {
      setErr(true);
    }
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
          <input type="file" id="sign__avatar" className="sign__avatar" />
          <label htmlFor="sign__avatar" className="sign__label">
            <RiImageAddFill className="sign__attach" />
            <p className="sign__add">Add an avatar</p>
          </label>
          <input type="submit" value="Sign Up" className="sign__submit" />
        </form>
        <p className="sign__para">
          Already have an account?{" "}
          <Link to="/signin" className="sign__signin">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
