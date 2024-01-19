//Firebase Connection

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  onValue
} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js"
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
  setDoc
} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js";

import {
  getStorage
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
const database = getDatabase(app);
const auth = getAuth();
const db = getFirestore(app);







function getUsers() {
  const userCards = document.querySelector("#userCards")
  const userTable = document.querySelector("#userTable")
  const modals = document.querySelector("#modals")

  const onGetUsers = (callback) => onSnapshot(collection(db, "users"), callback);
  onGetUsers((querySnapshot) => {

    querySnapshot.forEach((doc) => {
      //console.log(doc.data());

      const user = doc.data();
      user.id = doc.id;

      var tiempo = user.Tiempo

      if (tiempo == undefined) {
        tiempo = "0"
      } else {
        tiempo = user.Tiempo.length
      }

      var progreso = tiempo * 100 / 14;

      var last = user.Sesion

      if (last == undefined) {
        last = "N/A"
      } else {
        last = user.Sesion.at(-1)
      }

      var photo = user.Image

      if (photo == null) {
        photo = "https://media.discordapp.net/attachments/892475118108938343/934143722457813063/Monterey-1.jpeg"
      } else {
        photo = user.Image
      }

      var time = user.Tiempo

      var redondeo = "N/A"

      if (time == undefined) {
        redondeo = "N/A"

      } else {

        time = user.Tiempo

        var total = time.reduce((a, b) => a + b, 0);

        //console.log(total)

        var prom = total / time.length

        var mins = prom / 60

        redondeo = Math.round(mins)

      }

      var Class = user.clase

      var idClass = Class.replace(/\s/g, '');
      var tableClass = Class.replace(/\s/g, '');

      const filterClass = document.getElementById("filterClass")




      //<img src="${photo}" class="card-img-top img-fluid" alt="..."></img>

      userCards.innerHTML += `
            
        <div id="" class="col-md-4 ${idClass}">
        <div class="card">
        
        <div class="card-body">
          <div class="card-meet-header">
            <div class="card-meet-day">
          
              <h6>${user.id}</h6>
            </div>
            <div class="card-meet-text">
              <h6>${user.nombre}</h6>
            </div>
          </div>
          <br>
          <h5 class="card-text m-b-md">Uso del bot:</h5>
          <div id="myProgress" class="progress">
            <div class="progress-bar bg-primary progress-bar" role="progressbar" style="width:${progreso}%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
            <div class="mt-3"> <span class="text1">${tiempo} Sesiones <span class="text2">de 14</span></span></div>

            

            <div class="data mt-3">

            <div class="transactions-list">

                        <div class="transactions-list">
                                    <div class="tr-item">
                                      <div class="tr-company-name">
                                        <div class="tr-icon tr-card-icon tr-card-bg-secondary text-secondary">
                                          <i data-feather="book"></i>
                                        </div>
                                        <div class="tr-text">
                                          <h4>Clase:</h4>
                                          <p>${user.clase}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                        <div class="tr-item">
                          <div class="tr-company-name">
                            <div class="tr-icon tr-card-icon tr-card-bg-primary text-primary">
                            <i data-feather="calendar"></i>
                            </div>
                            <div class="tr-text">
                              <h4>Última Sesióon</h4>
                              <p>${last}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="transactions-list">
                        <div class="tr-item">
                          <div class="tr-company-name">
                            <div class="tr-icon tr-card-icon tr-card-bg-info text-info">
                            <i data-feather="clock"></i>
                            </div>
                            <div class="tr-text">
                              <h4>Tiempo promedio</h4>
                              <p>${redondeo} mins</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="transactions-list">
                        <div class="tr-item">
                          <div class="tr-company-name">
                            <div class="tr-icon tr-card-icon tr-card-bg-warning text-warning">
                              <i data-feather="bar-chart-2"></i>
                            </div>
                            <div class="tr-text">
                              <h4>Caracteres promedio</h4>
                              <p>N/A</p>
                            </div>
                          </div>
                        </div>
                      </div>  

                      <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#alumno-${user.id}">
  Ver Sesiones
</button>
            </div>
    </div>
                     
        </div>

        </div>
        `;



      modals.innerHTML += `

        <div class="modal fade" id="alumno-${user.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalScrollableTitle">Sesiones de ${user.nombre}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div id="sesionModal" class="modal-body">

      <p>${user.Respuestas}</p>
      
        
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
       
      </div>
    </div>
  </div>
</div>   

`;

      const sesionModal = document.getElementById("sesionModal")





      userTable.innerHTML += `

        <tr class="${tableClass}">
                                            <td>${user.id}</td>
                                            <td class="">${user.nombre}</td>
                                            <td><span class="badge rounded-pil bg-secondary">${user.clase}</span></td>
                                            <td> <div id="myProgress" class="progress" style="height: 20px;">
                                            <div class="progress-bar bg-primary progress-bar" role="progressbar" style="width:${progreso}%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">${tiempo}</div>
                                          </div></td>
                                            <td>${last}</td>
                                            <td>${redondeo} mins</td>
                                        </tr>


        `
      feather.replace()

      filterClass.onchange = function filtrar() {

        if (filterClass.value == "Abril2022Dr.Alex") {

          var elements = document.getElementsByClassName("Enero2022Dr.Alex")
          var elements2 = document.getElementsByClassName("Enero2022Ing.Mora")

          for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = " ";
          }

          for (var i = 0; i < elements2.length; i++) {

            elements2[i].style.display = 'none';


          }



        } else if (filterClass.value == "Enero2022Ing.Mora") {

          var elements = document.getElementsByClassName("Enero2022Dr.Alex")
          var elements2 = document.getElementsByClassName("Enero2022Ing.Mora")

          for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = "none";

          }

          for (var i = 0; i < elements2.length; i++) {
            elements2[i].style.display = "block";
          }


        } else if (filterClass.value == "Todos") {

          var elements = document.getElementsByClassName("Enero2022Dr.Alex")
          var elements2 = document.getElementsByClassName("Enero2022Ing.Mora")

          for (var i = 0; i < elements.length; i++) {
            elements[i].style.display = "block";
          }

          for (var i = 0; i < elements2.length; i++) {
            elements2[i].style.display = "block";
          }


        }

      }

    });
  });


  const searchID = document.getElementById("searchID")

  // searchID.addEventListener("input", e=> {


  //     var str = searchID.value
  //    window.find(str)

  // })
}



const cardView = document.getElementById("cardView")

const tableView = document.getElementById("tableView")

const cardViewContent = document.getElementById("cardViewContent")

const tableViewContent = document.getElementById("tableViewContent")

// cardView.addEventListener("click", e=> {
//   e.preventDefault()

//   cardViewContent.style.display = "block"
//   tableViewContent.style.display = "none"

//   console.log("aaaa")
// })

// tableView.addEventListener("click", e=> {
//   e.preventDefault()

//   cardViewContent.style.display = "none"
//   tableViewContent.style.display = "block"
// })







window.onload = function logedIn() {

  console.log("Recarga prro")

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;

      const docRef = onSnapshot(doc(db, "admins", uid), (doc) => {
        console.log("Current data: ", doc.data());
  
  
        const session = doc.data();

        const photo = document.getElementById("profileDropDown")
        const userName = document.getElementById("userName")

        if(session.photo != null){

          photo.innerHTML =  `<img class="pPhoto" src='${session.photo}' alt''> `;

        }else {
          photo.innerHTML =  `<img class="pPhoto" src='https://s3.amazonaws.com/admin.helputhink.net/assets/images/profile-bg.png' alt''> `;
        }

        

        userName.innerHTML +=  `${session.nombre}`;
  
        
      
    });
      

      //window.open("../index.html")


      console.log("sip")

      getUsers()
      // ...
    } else {

      window.open('../../login.html', '_self');

    }
  });

}


const logout = document.getElementById("logout")

logout.onclick = function signOutFunc() {
  signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}