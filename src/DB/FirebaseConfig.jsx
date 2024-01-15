import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB28RdYRbrka9rFgJJK5R_jzGMXBp3R5Yg",
  authDomain: "student-performance-820e1.firebaseapp.com",
  projectId: "student-performance-820e1",
  storageBucket: "student-performance-820e1.appspot.com",
  messagingSenderId: "196830596468",
  appId: "1:196830596468:web:8ad3f38f88a3b57114f021",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);
