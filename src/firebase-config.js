import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Replace these with your actual Firebase project credentials
const firebaseConfig = {
apiKey: "AIzaSyBERlHhbQy3HvzkAT9PbU2L8I7nI5dOua4",
  authDomain: "schoolhub-6c608.firebaseapp.com",
  databaseURL: "https://schoolhub-6c608-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "schoolhub-6c608",
  storageBucket: "schoolhub-6c608.firebasestorage.app",
  messagingSenderId: "1089563851539",
  appId: "1:1089563851539:web:833e167a39ceca0e0b38e6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
