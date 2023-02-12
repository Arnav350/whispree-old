import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function SignUp() {
  return (
    <div className="sign__container">
      <div className="sign">
        <h1 className="sign__title">Sign Up</h1>
        <h3 className="sign__logo">AnySpeak</h3>
        <form className="sign__form">
          <input type="text" placeholder="Username" className="sign__input" />
          <input type="text" placeholder="Email" className="sign__input" />
          <input type="text" placeholder="Password" className="sign__input" />
          <input
            type="text"
            placeholder="Confirm Password"
            className="sign__input"
          />
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
