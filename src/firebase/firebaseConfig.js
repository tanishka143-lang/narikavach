import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSy....",
  authDomain: "narikavach.firebaseapp.com",
  projectId: "narikavach",
  storageBucket: "narikavach.firebasestorage.app",
  messagingSenderId: "706703712110",
  appId: "1:706703712110:web:...",
};

const app = initializeApp(firebaseConfig);

export default app;
