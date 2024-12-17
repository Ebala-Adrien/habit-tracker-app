// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRZBe1TJaTWBjxMbatEChxFqWHjOcmQe0",
  authDomain: "habit-tracker-app-3cf38.firebaseapp.com",
  projectId: "habit-tracker-app-3cf38",
  storageBucket: "habit-tracker-app-3cf38.firebasestorage.app",
  messagingSenderId: "170007127574",
  appId: "1:170007127574:web:d298cbc40d2350986df737",
  measurementId: "G-Z5SJ48WSV8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };