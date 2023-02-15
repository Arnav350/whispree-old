import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDFqCo-4ImD2fLWa7pLBTzG1clP6TKoRyw",
  authDomain: "anyspeak-96959.firebaseapp.com",
  projectId: "anyspeak-96959",
  storageBucket: "anyspeak-96959.appspot.com",
  messagingSenderId: "803638944675",
  appId: "1:803638944675:web:3dfeb6ab1836e46a897016",
  measurementId: "G-QXCM2BJV07",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
