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

const auth           = getAuth();
const form           = document.getElementById("login-form");
const emailInput     = document.querySelector(".email");
const passwordInput  = document.querySelector(".password");
const message        = document.getElementById("message");
const togglePassword = document.getElementById("toggle-password");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const email    = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User logged in:", user);

      const docRef = doc(db, "adminAccess", user.uid);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          const adminCode = docSnap.data().code;
          sessionStorage.setItem("adminCode", adminCode);
          showMessage("Welcome back!", "success");
          setTimeout(() => {
            window.location.href = "admin.html";
          }, 800);
        } else {
          console.log("No admin document found", user.uid);
          showMessage("Unauthorized access!", "error");
        }
      });
    })
    .catch((error) => {
      console.error("Error logging in:", error);
      showMessage("Incorrect email or password!", "error");
    });
});

function showMessage(msg, type = "error") {
  message.textContent = msg;
  message.className   = "";           // clear old classes
  message.classList.add("show", type);

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
