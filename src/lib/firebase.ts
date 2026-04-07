import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBemFUcVv8xG2-ThvrAAmERTsJ6l8yWv7o",
  authDomain: "newssphere-a7e73.firebaseapp.com",
  projectId: "newssphere-a7e73",
  storageBucket: "newssphere-a7e73.firebasestorage.app",
  messagingSenderId: "128784926626",
  appId: "1:128784926626:web:6a43f85c251f5e7db0d4fb"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;