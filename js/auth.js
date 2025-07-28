// /js/auth.js
import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Register user
const registerBtn = document.getElementById('registerBtn');
if (registerBtn) {
  registerBtn.addEventListener('click', async () => {
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Registration successful!');
      window.location.href = 'index.html';
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
}

// Login user
const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
  loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
      window.location.href = 'index.html';
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
}
