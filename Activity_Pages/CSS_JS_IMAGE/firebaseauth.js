import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRatUYHxP824i_Fiyit7LoaBdCNJm_bE4",
  authDomain: "sia-pipeline.firebaseapp.com",
  projectId: "sia-pipeline",
  storageBucket: "sia-pipeline.firebasestorage.app",
  messagingSenderId: "1029300236937",
  appId: "1:1029300236937:web:983c7fc3ab51380add0c58",
  measurementId: "G-HRZ03SSTXG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Helper function to display messages
function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// ** Registration Functionality **
document.getElementById("submitSignUp").addEventListener("click", async (event) => {
  event.preventDefault();

  const fname = document.getElementById("rFname").value.trim();
  const lname = document.getElementById("rLname").value.trim();
  const email = document.getElementById("rEmail").value.trim();
  const password = document.getElementById("rPassword").value.trim();
  const cpassword = document.getElementById("rCPassword").value.trim();

  // Check if any field is empty
  if (!fname || !lname || !email || !password || !cpassword) {
    showMessage("Please fill out all fields.", "signUpMessage");
    return;
  }

  // Check if password and confirm password match
  if (password !== cpassword) {
    showMessage("Passwords do not match. Please try again.", "signUpMessage");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user details in Firestore
    await setDoc(doc(db, "users", user.uid), {
      firstName: fname,
      lastName: lname,
      email: email,
      createdAt: new Date(),
    });

    showMessage("Registration successful! You can now log in.", "signUpMessage");
    window.location.href = "index.html";
  } catch (error) {
    const errorMessage =
      error.code === "auth/email-already-in-use"
        ? "This email is already registered. Please log in."
        : error.code === "auth/weak-password"
        ? "Password must be at least 6 characters."
        : "Registration failed: " + error.message;

    showMessage(errorMessage, "signUpMessage");
    console.error(error);
  }
});

// Function to send OTP email
async function sendOtpEmail(recipientName, recipientEmail, otp) {
  const templateParams = {
    to_name: recipientName, // User's full name
    to_email: recipientEmail, // Recipient's email
    message: `${otp}`, // OTP message
  };

  try {
    const response = await emailjs.send("service_evq566f", "template_10o7zwy", templateParams);
    console.log(`OTP email sent successfully to: ${recipientEmail}`);
    showMessage("OTP sent to your email. Please verify.", "signInMessage");
    return true; // Indicate success
  } catch (emailError) {
    console.error("Failed to send OTP email:", emailError);
    let errorMessage = "Failed to send OTP email.";
    if (emailError?.message && emailError.message.includes("Network")) {
      errorMessage = "Network error. Please check your connection.";
    }
    showMessage(errorMessage, "signInMessage");
    return false; // Indicate failure
  }
}

// ** Login Functionality **
document.getElementById("submitSignIn").addEventListener("click", async (event) => {
  event.preventDefault();

  const fname = document.getElementById("rFname").value.trim();
  const lname = document.getElementById("rLname").value.trim();
  const email = document.getElementById("signInEmail").value.trim();
  const password = document.getElementById("signInPassword").value.trim();

  if (!email || !password) {
    showMessage("Please fill out all fields.", "signInMessage");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Generate OTP
    const otp = Math.floor(10000 + Math.random() * 90000); // Generate a 5-digit OTP

    // Send OTP email
    const fullName = `${fname} ${lname}` || "User"; // Use full name if available, fallback to "User"
    const otpSent = await sendOtpEmail(fullName, email, otp);

    if (otpSent) {
      // Store OTP and logged-in user details
      localStorage.setItem("otp", otp);
      localStorage.setItem("loggedInUserId", user.uid);

      window.location.href = "otp.html";
    } else {
      showMessage("OTP could not be sent. Please try again.", "signInMessage");
    }
  } catch (error) {
    let errorMessage = "Login failed: " + error.message;

    switch (error.code) {
      case "auth/wrong-password":
        errorMessage = "Invalid password. Please try again.";
        break;
      case "auth/user-not-found":
        errorMessage = "Email does not exist. Please register first.";
        break;
      case "auth/invalid-email":
        errorMessage = "Invalid email address format.";
        break;
      case "auth/too-many-requests":
        errorMessage = "Too many failed login attempts. Please try again later.";
        break;
      case "auth/network-request-failed":
        errorMessage = "Network error. Please check your connection.";
        break;
    }

    console.error("Login error:", error);
    showMessage(errorMessage, "signInMessage");
  }
});
