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
  setDoc,
  arrayUnion
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

const auth = getAuth();
const db = getFirestore(app);

const Sdoc = doc

var fileStorageURL

var Sref
const date = document.getElementById('dateInput')
const classSelect = document.getElementById('select_class')

let addSession = document.getElementById("addSession");

function setRef() {

  var firstValue = document.getElementById('select_class').value
  console.log(firstValue)
  var secondValue = document.getElementById('dateInput').value.split("/");
  console.log(secondValue)
  Sref = "S-" + firstValue + secondValue.join("");

  var sku1 = Sref.toUpperCase();
  console.log(sku1)
  document.getElementById('ref').value = sku1;


}


classSelect.addEventListener("change", (e) => {
  e.preventDefault()
  setRef()
})

date.addEventListener("focus", (e) => {
  e.preventDefault()
  setRef()
})


const dragArea = document.querySelector('.drag-area');
const dragText = document.querySelector('.header');
const dragText2 = document.querySelector('.header2');
const dragIcon = document.querySelector('.size-18');
const fileTypeT = document.querySelector('.fileType')

let button = document.getElementById('search');
let Cancelbutton = document.querySelector('.button-cancel');
let input = document.getElementById('input');

let file;
let fileURL;
let sesionRef;

console.log("drag");


button.onclick = () => {
  console.log("picoooo")
  input.click();
}



Cancelbutton.addEventListener('click', (e) => {
  dragText.textContent = "Arrastra y suelta el archivo";
  dragText2.innerHTML = "o " + '<span id="search" class="button">búscalo</span>';
  fileTypeT.textContent = "Tipo de archivo soportado: PDF"
  dragArea.classList.remove('success');
  dragArea.classList.remove('dragBG');
  Cancelbutton.style.display = "none";
  fileURL = "";

})

input.addEventListener('change', function () {
  file = this.files[0];
  displayFile();
})

dragArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dragText.textContent = "¡Sueltalo!";
  dragText2.innerHTML = "o " + '<span id="search" class="button">búscalo</span>';
  dragText.classList.remove('text-error');
  dragArea.classList.add('active');
  dragArea.classList.remove('error');
  dragArea.classList.remove('animate__headShake')
  Cancelbutton.style.display = "none";
});

dragArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dragText.textContent = "Arrastra y suelta el archivo";
  dragArea.classList.remove('active');
  dragArea.classList.remove('animate__headShake')
  Cancelbutton.style.display = "none";

});

dragArea.addEventListener('drop', (e) => {
  e.preventDefault();

  file = e.dataTransfer.files[0];



  displayFile();




});

function displayFile() {
  let fileType = file.type;

  let validExtension = ['application/pdf'];

  if (validExtension.includes(fileType)) {

    dragArea.classList.add('success');
    dragArea.classList.add('dragBG');
    console.log(file)

    dragText.textContent = `${file.name}`
    dragText2.textContent = ""
    let mb = Math.round(file.size / 994);
    fileTypeT.textContent = `Tamaño: ${mb} KB`
    Cancelbutton.style.display = "block";

    let fileReader = new FileReader();

    fileReader.onload = () => {
      fileURL = fileReader.result;
      console.log(fileURL);






    };

    fileReader.readAsDataURL(file);





  } else {
    dragArea.classList.remove('active');
    dragArea.classList.add('error');
    dragText.classList.add('text-error');
    dragArea.classList.add('animate__headShake')
    dragText.textContent = "¡El archivo que añadiste no es un PDF! ";
    dragText2.innerHTML = "o " + '<span id="search" class="button">búscalo</span>';
    fileTypeT.textContent = "Tipo de archivo soportado: PDF"
    dragArea.classList.remove('success');
    dragArea.classList.remove('dragBG');
    Cancelbutton.style.display = "none";
  }
}


addSession.addEventListener("click", (e) => {
  e.preventDefault();

  const storageRef = ref(storage, Sref);

  uploadString(storageRef, fileURL, 'data_url').then((snapshot) => {
    console.log('Archivo Subido');

    getDownloadURL(ref(storage, Sref))
      .then((url) => {

        fileStorageURL = url;


        const addSes = doc(db, "sesiones", Sref);


        setDoc(addSes, {
          referencia: Sref,
          pdf: fileStorageURL,
          estado: "Sin_Evaluar",
          uidEvaluado: arrayUnion(),
          evaluadoPor: arrayUnion(),

        });

        setTimeout(function () {
          location.reload();
        }, 500);



        //console.log(fileStorageURL)
      })
      .catch((error) => {
        // Handle any errors
      });


  });


})



function logedIn() {

  console.log("Hola?")

  onAuthStateChanged(auth, (user) => {

    if (user) {

      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;

      console.log(uid)

      function getSessions() {
        const sessionCard = document.getElementById("sessionCard")
        const sessionCardOk = document.getElementById("sessionCardOk")
        const sessionCardSelf = document.getElementById("sessionCardSelf")

        const onGetUsers = (callback) => onSnapshot(collection(db, "sesiones"), callback);
        const deleteSession = id => db.collection("sesiones").doc(id).delete()
        onGetUsers((querySnapshot) => {

          querySnapshot.forEach((docu) => {
            //console.log(doc.data());

            const session = docu.data();
            session.id = docu.id;

            




            if (session.evaluadoPor != null) {

              console.log(session.evaluadoPor.length)

            }

            const notYet = document.getElementById("notYet")


            if (session.estado == "Sin_Evaluar" || session.estado == "Pre_Evaluado") {

              if(session.uidEvaluado.includes(uid)){

               

                notYet.style.display = "none"

                let oraciones = session.oraciones

                oraciones = oraciones.map(i => `<li>${i}</li>`).join('');

                sessionCardSelf.innerHTML += `
          
                    <div class="col-md-5 col-12">
                  <div class="card">
                    <div class="card-body">
                      <div class="card-meet-header">
                        <div class="card-meet-text">
                          <h6>Sesión: ${session.referencia}</h6>
                        </div>
                       
                      </div>
                      <div class="data mt-3">
          
                        <div class="transactions-list">
          
                          <div class="transactions-list">
                            <div class="tr-item">
                              <div class="tr-company-name">
                                <div class="tr-icon tr-card-icon tr-card-bg-warning text-secondary">
                                  <i class="text-warning" data-feather="clipboard"></i>
                                </div>
                                <div class="tr-text">
                                  <h4>Estado:</h4>
                                  <p>Pre-Evaluada</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          
          
                          <a href="${session.pdf}" target="_blank">
                            <div class="transactions-list">
                              <div class="tr-item">
                                <div class="tr-company-name">
                                  <div class="tr-icon tr-card-icon tr-card-bg-primary text-secondary">
                                    <i class="text-primary" data-feather="file-text"></i>
                                  </div>
                                  <div class="tr-text">
                                    <h4>Archivo:</h4>
                                    <p>${session.referencia}.pdf</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>

                          <div class="transactions-list">
                          <div class="tr-item">
                            <div class="tr-company-name">
                              <div class="tr-icon tr-card-icon tr-card-bg-info text-secondary">
                                <i class="text-info" data-feather="award"></i>
                              </div>
                              <div class="tr-text">
                                <h4>Evaluó:</h4>
                                <div id="evaList"><p><i style="width: 15px; height: 15px;" class="text-success" data-feather="check-circle"></i> ${session.evaluadoPor.join('<br> <i style="width: 15px; height: 15px;" class="text-success" data-feather="check-circle"></i> ')} </p></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="transactions-list">
                        <div class="tr-item">
                          <div class="tr-company-name">
                            <div class="tr-icon tr-card-icon tr-card-bg-info text-secondary">
                              <i class="text-info" data-feather="list"></i>
                            </div>
                            <div class="tr-text">
                              <h4>Oraciones:</h4>
                              <p>${oraciones}</p>
                            </div>
                          </div>
                        </div>
                      </div>


                          
          
          
                        </div>
                      </div>
                    </div>
          
                  </div>
                </div>
                  
            
              `;

              
              }else {

                let oraciones = session.oraciones

                oraciones = oraciones.map(i => `<li>${i}</li>`).join('');

                sessionCard.innerHTML += `
          
                    <div class="col-md-5 col-12">
                  <div class="card">
                    <div class="card-body">
                      <div class="card-meet-header">
                        <div class="card-meet-text">
                          <h6>Sesión: ${session.referencia}</h6>
                        </div>
                       
                      </div>
                      <div class="data mt-3">
          
                        <div class="transactions-list">
          
                          <div class="transactions-list">
                            <div class="tr-item">
                              <div class="tr-company-name">
                                <div class="tr-icon tr-card-icon tr-card-bg-danger text-secondary">
                                  <i class="text-danger" data-feather="x-octagon"></i>
                                </div>
                                <div class="tr-text">
                                  <h4>Estado:</h4>
                                  <p>Sin Evaluar</p>
                                </div>
                              </div>
                            </div>
                          </div>
          
                          <a href="${session.pdf}" target="_blank">
                            <div class="transactions-list">
                              <div class="tr-item">
                                <div class="tr-company-name">
                                  <div class="tr-icon tr-card-icon tr-card-bg-primary text-secondary">
                                    <i class="text-primary" data-feather="file-text"></i>
                                  </div>
                                  <div class="tr-text">
                                    <h4>Archivo:</h4>
                                    <p>${session.referencia}.pdf</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>

                          <div class="transactions-list">
                          <div class="tr-item">
                            <div class="tr-company-name">
                              <div class="tr-icon tr-card-icon tr-card-bg-info text-secondary">
                                <i class="text-info" data-feather="award"></i>
                              </div>
                              <div class="tr-text">
                                <h4>Evaluado por:</h4>
                                <div id="evaList"><p><i style="width: 15px; height: 15px;" class="text-success" data-feather="check-circle"></i> ${session.evaluadoPor.join('<br> <i style="width: 15px; height: 15px;" class="text-success" data-feather="check-circle"></i> ')} </p></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="transactions-list">
                        <div class="tr-item">
                          <div class="tr-company-name">
                            <div class="tr-icon tr-card-icon tr-card-bg-info text-secondary">
                              <i class="text-info" data-feather="list"></i>
                            </div>
                            <div class="tr-text">
                              <h4>Oraciones:</h4>
                              <p>${oraciones}</p>
                            </div>
                          </div>
                        </div>
                      </div>


                         
                          <!-- <button type="button" class="btn btn-danger btn-delete" data-id="${session.referencia}">Eliminar Sesión</button> -->
          
          
                        </div>
                      </div>
                    </div>
          
                  </div>
                </div>
                  
            
              `;

           
             

              }

            } else {

              var cal

              if (session.calificación == undefined) {
                cal = "N/A"
              } else {
                cal = session.calificación
              }

              var comm

              if (session.comentarios == undefined) {
                comm = "N/A"
              } else {
                comm = session.comentarios
              }

              var eva

              if (session.evaluo == undefined) {
                eva = "N/A"
              } else {
                eva = session.evaluo
              }

              



              sessionCardOk.innerHTML += `
          
                    <div class="col-md-5 col-12">
                  <div class="card">
                    <div class="card-body">
                      <div class="card-meet-header">
                        <div class="card-meet-text">
                          <h6>Sesión: ${session.referencia}</h6>
                        </div>
                       
                      </div>
                      <div class="data mt-3">
          
                        <div class="transactions-list">
          
                          <div class="transactions-list">
                            <div class="tr-item">
                              <div class="tr-company-name">
                                <div class="tr-icon tr-card-icon tr-card-bg-success text-secondary">
                                  <i class="text-success" data-feather="check-circle"></i>
                                </div>
                                <div class="tr-text">
                                  <h4>Estado:</h4>
                                  <p>${session.estado}</p>
                                </div>
                              </div>
                            </div>
                          </div>
          
                          <div class="transactions-list">
                            <div class="tr-item">
                              <div class="tr-company-name">
                                <div class="tr-icon tr-card-icon tr-card-bg-secondary text-secondary">
                                  <i class="text-secondary" data-feather="star"></i>
                                </div>
                                <div class="tr-text">
                                  <h4>Calificación:</h4>
                                  <p>${cal}</p>
                                </div>
                              </div>
                            </div>
                          </div>
          
                          <a href="${session.pdf}" target="_blank">
                            <div class="transactions-list">
                              <div class="tr-item">
                                <div class="tr-company-name">
                                  <div class="tr-icon tr-card-icon tr-card-bg-primary text-secondary">
                                    <i class="text-primary" data-feather="file-text"></i>
                                  </div>
                                  <div class="tr-text">
                                    <h4>Archivo:</h4>
                                    <p>${session.referencia}.pdf</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>
          
                          <div class="transactions-list">
                          <div class="tr-item">
                            <div class="tr-company-name">
                              <div class="tr-icon tr-card-icon tr-card-bg-info text-secondary">
                                <i class="text-info" data-feather="award"></i>
                              </div>
                              <div class="tr-text">
                                <h4>Evaluó:</h4>
                                <p>${eva}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="transactions-list">
                        <div class="tr-item">
                          <div class="tr-company-name">
                            <div class="tr-icon tr-card-icon tr-card-bg-info text-secondary">
                              <i class="text-info" data-feather="award"></i>
                            </div>
                            <div class="tr-text">
                              <h4>Oraciones:</h4>
                              <p>${session.oraciones}</p>
                            </div>
                          </div>
                        </div>
                      </div>
          
                          <div class="transactions-list">
                            <div class="tr-item">
                              <div class="tr-company-name">
                                <div class="tr-icon tr-card-icon tr-card-bg-warning text-secondary">
                                  <i class="text-warning" data-feather="message-square"></i>
                                </div>
                                <div class="tr-text">
                                  <h4>Comentarios:</h4>
                                  <p>${comm}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
          
                  </div>
                </div>
                  
            
              `;



            }




            //<img src="${photo}" class="card-img-top img-fluid" alt="..."></img>



            const btnsDelete = document.querySelectorAll(".btn-delete");
            btnsDelete.forEach(btn => {
              btn.addEventListener("click", (e) => {
                console.log(e.target)


                deleteDoc(Sdoc(db, "sesiones", e.target.dataset.id))

                setTimeout(function () {
                  location.reload();
                }, 300);



              })
            })


            feather.replace()


          });
        });


      }

      getSessions()


      // ...
    } else {

      window.open('../../login.html', '_self');

    }
  });

}





window.onload = logedIn();