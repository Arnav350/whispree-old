import React, { useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { FormReducer } from "../reducers/FormReducer";
import { z } from "zod";
import { RiImageAddFill } from "react-icons/ri";
import "../App.css";
import Logo from "../assets/Logo.png";

const User = z
  .object({
    username: z
      .string({
        required_error: "Username is required",
      })
      .min(3, { message: "Username must be at least 3 characters" })
      .max(20, { message: "Username must be at most 20 chacters" }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email({ message: "Invalid email address" }),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, { message: "Password must be at least 6 characters" })
      .max(20, { message: "Password must be at most 20 chacters" }),
    confirm: z.string({
      required_error: "Confirm Password is required",
    }),
  })
  .strict()
  .refine(({ password, confirm }) => password === confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

function SignUp() {
  const [err, setErr] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useReducer(FormReducer, {});
  const [formError, setFormError] = useState<Record<string, string>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedUser = User.safeParse(formData);
    if (parsedUser.success) {
      setFormError({});
    } else {
      const error = parsedUser.error;
      let newError = {};
      for (const issue of error.issues) {
        newError = {
          ...newError,
          [issue.path[0]]: issue.message,
        };
      }
      setFormError(newError);
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      fetch(Logo)
        .then((res) => res.blob())
        .then((blob) => {
          const avatar = file || new File([blob], "default.png", blob);

          const storageRef = ref(storage, formData.username);

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
            (error) => {
              setErr(true);
              console.log(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(
                async (downloadURL) => {
                  await updateProfile(res.user, {
                    displayName: formData.username,
                    photoURL: downloadURL,
                  });

                  await setDoc(doc(db, "users", res.user.uid), {
                    uid: res.user.uid,
                    displayName: formData.username,
                    email: formData.email,
                    photoURL: downloadURL,
                  });

                  await setDoc(doc(db, "userChats", res.user.uid), {});
                  navigate("/");
                }
              );
            }
          );
        });
    } catch (error) {
      setErr(true);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) setFile(event.target.files[0]);
  }

  return (
    <div className="sign__container">
      <div className="sign">
        <h1 className="sign__title">Sign Up</h1>
        <h3 className="sign__logo">AnySpeak</h3>
        {err && <p>There was an error</p>}
        <form className="sign__form" onSubmit={handleSubmit}>
          <div className="sign__box">
            <input
              type="text"
              placeholder="Username"
              name="username"
              className="sign__input"
              onChange={setFormData}
            />
            {formError.username && (
              <p className="sign__error">{formError.username}</p>
            )}
          </div>
          <div className="sign__box">
            <input
              type="email"
              placeholder="Email"
              name="email"
              className="sign__input"
              onChange={setFormData}
            />
            {formError.email && (
              <p className="sign__error">{formError.email}</p>
            )}
          </div>
          <div className="sign__box">
            <input
              type="password"
              placeholder="Password"
              name="password"
              className="sign__input"
              onChange={setFormData}
            />
            {formError.password && (
              <p className="sign__error">{formError.password}</p>
            )}
          </div>
          <div className="sign__box">
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirm"
              className="sign__input"
              onChange={setFormData}
            />
            {formError.confirm && (
              <p className="sign__error">{formError.confirm}</p>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            name="avatar"
            id="sign__avatar"
            className="sign__avatar"
            onChange={handleChange}
          />
          <label htmlFor="sign__avatar" className="sign__label">
            <div className="sign__attach">
              <RiImageAddFill className="sign__icon" />
              <p className="sign__add">Add an avatar</p>
            </div>
            {file && (
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="sign__file"
              />
            )}
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
