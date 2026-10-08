import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDE3kV3P28s5HXCl1XQDfDKA45BpW4hBSk",
  authDomain: "auth-app-b54a4.firebaseapp.com",
  projectId: "auth-app-b54a4",
  storageBucket: "auth-app-b54a4.firebasestorage.app",
  messagingSenderId: "621629238169",
  appId: "1:621629238169:web:1ee67dfa08ac4c260a8108",
  measurementId: "G-H4KPDP99BT"
};

// Turn Firebase error codes into messages a user can act on.
export const friendly = (err) => {
  switch (err.code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Try logging in.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/invalid-credential":
      return "Email or password is incorrect.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a moment and try again.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    default:
      return "Something went wrong. Please try again.";
  }
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);