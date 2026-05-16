// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoujP-QvncZK1JqtfiwQMXhO0pnEsKZ-M",
  authDomain: "narikavach.firebaseapp.com",
  projectId: "narikavach",
  storageBucket: "narikavach.firebasestorage.app",
  messagingSenderId: "706703712110",
  appId: "1:706703712110:web:62e28c1bb159d7cea9ab7f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
