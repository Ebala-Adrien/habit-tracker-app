import  { initializeApp } from "firebase/app";
import { getAuth, initializeAuth,
    // @ts-ignore
    getReactNativePersistence,
 } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// https://stackoverflow.com/questions/76914913/cannot-import-getreactnativepersistence-in-firebase10-1-0/76943639#76943639

const firebaseConfig = {
  apiKey: "AIzaSyBRZBe1TJaTWBjxMbatEChxFqWHjOcmQe0",
  authDomain: "habit-tracker-app-3cf38.firebaseapp.com",
  projectId: "habit-tracker-app-3cf38",
  storageBucket: "habit-tracker-app-3cf38.firebasestorage.app",
  messagingSenderId: "170007127574",
  appId: "1:170007127574:web:d298cbc40d2350986df737",
  measurementId: "G-Z5SJ48WSV8"
};

const app = initializeApp(firebaseConfig, {

});
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { db, auth };