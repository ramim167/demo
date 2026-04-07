import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGJe4xBXouZv5VjrBBDSq9bdaE9NeAaQg",
  authDomain: "jersey-cda63.firebaseapp.com",
  projectId: "jersey-cda63",
  storageBucket: "jersey-cda63.firebasestorage.app",
  messagingSenderId: "396572231052",
  appId: "1:396572231052:web:a82374cfe9ea477ad642a9",
  measurementId: "G-1KR2LCHT94"
};

const app = initializeApp(firebaseConfig);

export { app };
export const auth = getAuth(app);
export const db = getFirestore(app);
