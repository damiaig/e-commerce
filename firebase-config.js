// firebase-config.js
import { getStorage } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-storage.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js"; 
import { getAuth } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

// Replace with your own config
const firebaseConfig = {
    apiKey: "AIzaSyDNlR-43Sx83Uzu8vaszWEMgm5DlrseSI8",
    authDomain: "e-commerce-433bc.firebaseapp.com",
    projectId: "e-commerce-433bc",
    storageBucket: "e-commerce-433bc.firebasestorage.app",
    messagingSenderId: "574719884878",
    appId: "1:574719884878:web:f55058ddd07393a2e08d1f",
    measurementId: "G-DCPY846J9E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
