import { db } from './firebase-config.js';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js';

const auth = getAuth();

const form = document.getElementById("login-form");
const emailInput = document.querySelector(".email");
const passwordInput = document.querySelector(".password");
const message = document.getElementById("message");
const togglePassword = document.getElementById("toggle-password");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get email and password
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  // Authenticate using Firebase Authentication
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Successfully logged in
      const user = userCredential.user;
      console.log("User logged in:", user);

      // Retrieve the admin code from Firestore after successful login
 
      const docRef = doc(db, "adminAccess", user.uid);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          const adminCode = docSnap.data().code;
          sessionStorage.setItem("adminCode", adminCode);
          window.location.href = "admin.html";
        } else {
          console.log("No admin document found", user.uid);
          showMessage("Unauthorized access!");
        }
      });
    })
    .catch((error) => {
      console.error("Error logging in:", error);
      showMessage("Incorrect email or password!");
    });
});

function showMessage(msg) {
  message.textContent = msg;
  message.classList.add("show");

  setTimeout(() => {
    message.classList.remove("show");
  }, 3000);
}

// Toggle show/hide password
togglePassword.addEventListener("click", () => {
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  togglePassword.textContent = type === "password" ? "Show Password" : "Hide Password";
});