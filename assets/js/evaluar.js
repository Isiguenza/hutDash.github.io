import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
//import { getDatabase, set, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js"
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js";
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
    arrayUnion,
    setDoc
} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js";

import {
    getStorage,
    ref,
    uploadString,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-storage.js"

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
const storage = getStorage();

let userUID = ""

const auth = getAuth();
const db = getFirestore(app);

const docFS = doc

var references = [];

let randRef

let usuario = ""

const sessionRefText = document.getElementById("sessionRefText")
const sessionRefPDF = document.getElementById("sessionRefPDF")
let sessionComments = document.getElementById("sessionComments")
let evaluateBtn = document.getElementById("evaluateBtn")
let sendbtn = document.getElementById("sendbtn")
let value1 = document.getElementById("value1")
let value2 = document.getElementById("value2")
let value3 = document.getElementById("value3")
let value4 = document.getElementById("value4")
let value5 = document.getElementById("value5")
let modal = document.getElementById("modal")
let error = document.getElementById("error")
let noSession = document.getElementById("noSession")
let cardSesion = document.getElementById("sessionPlace")




  function getSession() {
    const docRef = onSnapshot(doc(db, "sesiones", randRef), (doc) => {
      console.log("Current data: ", doc.data());


      const session = doc.data();

      sessionRefText.innerHTML += `
  
      <p><span class="tablespan">Sesión: ${session.referencia}</span></p>

      
      `


      sessionRefPDF.innerHTML += `
  
      <embed class="pdfEmbed" src="${session.pdf}" width="100%" type="application/pdf">
      
      
      
      
      `
  });

   
  }

sendbtn.addEventListener("click", e => {
  e.preventDefault()

  error.innerHTML = "<p>¿Estás seguro de que quieres evaluar esta sesión?</p>"
})



window.onload = function getUID() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;

      userUID = uid

      console.log(uid)


      const onGetSessionRef = (callback) => onSnapshot(collection(db, "sesiones"), callback);
onGetSessionRef((querySnapshot) => {

        querySnapshot.forEach((doc) => {
            //console.log(doc.data());

            const session = doc.data();
            session.id = doc.id;

            if(!session.uidEvaluado.includes(uid)){
              references.push(session.id)
            }

            console.log(references)

        feather.replace()


        });
    });

  




setTimeout(function() {
    randRef = references[Math.floor(Math.random() * references.length)];

console.log(randRef)

if(randRef == undefined){

  noSession.style.display = "block"
  cardSesion.style.display = "none"

}
else {

  noSession.style.display = "none"
  cardSesion.style.display = "flex"

}

 
getSession()

  }, 1000)



      const userRef = onSnapshot(doc(db, "admins", uid), (doc) => {

        const admins = doc.data();

        usuario = admins.nombre

        evaluateBtn.addEventListener("click", (e)=> {
          e.preventDefault();
        
        
         var sesionComm = sessionComments.value
        
         if(value1.value == 0 || value2.value == 0 || value3.value == 0 || value4.value == 0 || value5.value == 0 ){
        
          modal.classList.add('animate__headShake')
        
          error.innerHTML = `<p class="">Ocurrió un error:</p>
          <p class="text-danger">Uno o más de los criterios de evalucación no tienen calificación, por favor corrigelo e intenta de nuevo</p>`
        
          setTimeout(function() {
         
            modal.classList.remove('animate__headShake')
        
          }, 600)
        
        
         }
         else {
        
          var calif = (parseInt(value1.value) + parseInt(value2.value) + parseInt(value3.value) + parseInt(value4.value) + parseInt(value5.value))/5
        
        
         var upadateSession = docFS(db, "sesiones", randRef);
        
                    
        
          updateDoc(upadateSession,{
              estado: "Pre_Evaluado",
              comentarios: arrayUnion(admins.nombre + ": " + sesionComm),
              //calificación: calif,
              uidEvaluado: arrayUnion(uid),
              calificaciones: arrayUnion(calif + " " + admins.nombre),
              evaluadoPor: arrayUnion(admins.nombre)
          });
        
        
          setTimeout(function() {
         
            location.reload();
        
          }, 500)
        
         }
        
         
        
        
        })

       
  
        
  
  
    
    });

 
      // ...
    } else {
      window.open('../../login.html', '_self');
    }
  });
}





