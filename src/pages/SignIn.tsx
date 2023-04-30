import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import "../App.css";

function SignIn() {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: any) {
    event.preventDefault();

    const email = event.target[0].value;
    const password = event.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setErr(true);
    }
  }

  return (
    <div className="sign__container">
      <div className="sign">
        <h1 className="sign__title">Sign In</h1>
        <h3 className="sign__logo">AnySpeak</h3>
        {err && <p>There was an error</p>}
        <form className="sign__form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Email" className="sign__input" />
          <input
            type="password"
            placeholder="Password"
            className="sign__input"
          />
          <input type="submit" value="Sign In" className="sign__submit" />
        </form>
        <p className="sign__para">
          Don't have an account?{" "}
          <Link to="/signup" className="sign__sign">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
