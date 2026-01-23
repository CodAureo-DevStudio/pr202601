import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAO6azVpX988Vwu___-pp9c0oprqPThMlQ",
  authDomain: "matematica-em-foco.firebaseapp.com",
  projectId: "matematica-em-foco",
  storageBucket: "matematica-em-foco.firebasestorage.app",
  messagingSenderId: "1031540454030",
  appId: "1:1031540454030:web:af79c9407ffc7dfd694fdf",
  measurementId: "G-0TGT0E9YL8",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, analytics, db, storage, auth, firebaseConfig };

/* root@J/A:~# */
