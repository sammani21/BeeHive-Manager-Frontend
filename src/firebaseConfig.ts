// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDA4GAY3NT7WPyjd0ye0MMAheTojpNnd1I",
    authDomain: "beehive-manager-de852.firebaseapp.com",
    projectId: "beehive-manager-de852",
    storageBucket: "beehive-manager-de852.firebasestorage.app",
    messagingSenderId: "342955592528",
    appId: "1:342955592528:web:734ccc6c734cdf3b6aba55",
    measurementId: "G-H6GXDVD1B0"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
