// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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

// ** User Session Handling **
onAuthStateChanged(auth, (user) => {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  if (user && loggedInUserId) {
    const docRef = doc(db, "users", loggedInUserId);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          document.getElementById("loggedUserFName").innerText = userData.firstName +"!";
        } else {
          console.log("No document found matching the ID");
        }
      })
      .catch((error) => {
        console.error("Error getting document: ", error);
      });
  } else {
    console.log("User ID not found in local storage. Redirecting...");
    window.location.href = "index.html";
  }
});

// ** Logout Functionality **
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("loggedInUserId");
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Error signing out: ", error);
    });
});
