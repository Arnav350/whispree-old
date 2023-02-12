import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function SignUp() {
  return (
    <div className="signup">
      <div className="signup__box">
        <h1 className="signup__title">Sign Up</h1>
        <h3 className="signup__logo">AnySpeak</h3>
        <form className="signup__form">
          <input type="text" placeholder="Username" className="signup__input" />
          <input type="text" placeholder="Email" className="signup__input" />
          <input type="text" placeholder="Password" className="signup__input" />
          <input
            type="text"
            placeholder="Confirm Password"
            className="signup__input"
          />
          <input type="submit" value="Sign Up" className="signup__submit" />
        </form>
        <p className="signup__para">
          Already have an account?{" "}
          <Link to="/signup" className="signup__signin">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
