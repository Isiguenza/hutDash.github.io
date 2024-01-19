
//Firebase Connection

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
import { getDatabase, set, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  setDoc
}  from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCd0nIg0vOkJeql3tZ2-8-_8-b0EBnd98o",
  authDomain: "helputhinkdash.firebaseapp.com",
  databaseURL: "https://helputhinkdash-default-rtdb.firebaseio.com",
  projectId: "helputhinkdash",
  storageBucket: "helputhinkdash.appspot.com",
  messagingSenderId: "160207914567",
  appId: "1:160207914567:web:2156481a23e66c342a9362"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();
const db = getFirestore(app);




  const loginBtn = document.getElementById("loginBtn")


  loginBtn.addEventListener("click", e=>{
    e.preventDefault()

    const loginEmail = document.getElementById("floatingInput").value
    const loginPasssword = document.getElementById("floatingPassword").value


    signInWithEmailAndPassword(auth, loginEmail, loginPasssword)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      window.open('../../index.html', '_self');


      
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      alert("Ups ocurrio un error: " + errorMessage)
    });

    

})


  