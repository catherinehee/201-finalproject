import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

//const firebaseConfig = {
//  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//  appId: process.env.REACT_APP_FIREBASE_APP_ID,
//  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
//};
const firebaseConfig = {
  apiKey: "AIzaSyBad8k8jpnmO9Frlu4m7O75H5E2zXDsJDU",
  authDomain: "project-d0622.firebaseapp.com",
  projectId: "project-d0622",
  storageBucket: "project-d0622.appspot.com",
  messagingSenderId: "972792751741",
  appId: "1:972792751741:web:8661ad00eb7e5e8102b314",
  measurementId: "G-K5DF96NSXT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export default app;
