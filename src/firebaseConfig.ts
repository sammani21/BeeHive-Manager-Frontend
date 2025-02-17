// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, onMessage } from "firebase/messaging";

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
const db = getFirestore(app);
const storage = getStorage(app);
const messaging = getMessaging(app);

// Handling incoming FCM messages (when app is in the foreground)
onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);
  // You could also store the notification in Firestore here
});

export { auth, googleProvider, db, storage, messaging };
