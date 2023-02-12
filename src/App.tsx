import React from "react";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// firebase.initializeApp({
//   apiKey: "AIzaSyDFqCo-4ImD2fLWa7pLBTzG1clP6TKoRyw",
//   authDomain: "anyspeak-96959.firebaseapp.com",
//   projectId: "anyspeak-96959",
//   storageBucket: "anyspeak-96959.appspot.com",
//   messagingSenderId: "803638944675",
//   appId: "1:803638944675:web:3dfeb6ab1836e46a897016",
//   measurementId: "G-QXCM2BJV07",
// });

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFqCo-4ImD2fLWa7pLBTzG1clP6TKoRyw",
  authDomain: "anyspeak-96959.firebaseapp.com",
  projectId: "anyspeak-96959",
  storageBucket: "anyspeak-96959.appspot.com",
  messagingSenderId: "803638944675",
  appId: "1:803638944675:web:3dfeb6ab1836e46a897016",
  measurementId: "G-QXCM2BJV07",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
