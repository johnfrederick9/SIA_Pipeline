// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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
const db = getFirestore(app);

// Fetch and display users
async function fetchUsers() {
  try {
    const usersCollection = collection(db, "users");
    const userDocs = await getDocs(usersCollection);
    const tableBody = document.querySelector(".table tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    userDocs.forEach((doc) => {
      const userData = doc.data();
      const row = `<tr>
                    <td>${doc.id}</td>
                    <td>${userData.firstName} ${userData.lastName}</td>
                    <td>${userData.email}</td>
                    <td>${userData.role || "User"}</td>
                   </tr>`;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    console.error("Error fetching users: ", error);
  }
}

// Fetch users on page load
document.addEventListener("DOMContentLoaded", fetchUsers);

// ** Admin Logout Functionality **
document.getElementById("adminLogoutButton")?.addEventListener("click", () => {
  localStorage.removeItem("isAdmin");
  window.location.href = "index.html"; // Redirect to login page
});
