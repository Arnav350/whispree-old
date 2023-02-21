import React from "react";
import { UseAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import PrivateRoute from "./components/PrivateRoute";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { User } from "firebase/auth";
import "./App.css";

function App() {
  const currentUser: User | null = UseAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            // <PrivateRoute>
            currentUser ? <Home /> : <SignIn />
            // </PrivateRoute>
          }
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
