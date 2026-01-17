// Firebase configuration and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCXdIbIirb-FyYcMehvGN1fy7Wi-Es0g4",
  authDomain: "vision3-e33ef.firebaseapp.com",
  projectId: "vision3-e33ef",
  storageBucket: "vision3-e33ef.firebasestorage.app",
  messagingSenderId: "803723809483",
  appId: "1:803723809483:web:37c20c35a558d2677fc14e",
  measurementId: "G-R40MGZ45NW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Export Firebase services
export { app, auth, db, analytics };
