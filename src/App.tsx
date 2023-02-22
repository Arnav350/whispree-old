import React from "react";
import { UseAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { User } from "firebase/auth";
import "./App.css";

function App() {
  const currentUser: User | null = UseAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={currentUser ? <Home /> : <SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
