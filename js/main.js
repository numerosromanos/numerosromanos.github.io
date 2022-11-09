"use strict";

let iniciarCaja = document.querySelector(".iniciarCaja");
let iniciarMayor = document.querySelector(".iniciarMayor");
let iniciarKahoot = document.querySelector(".iniciarKahoot");
let iniciarRuleta = document.querySelector(".iniciarRuleta");

let selectDifficulty = document.querySelector(".selectDifficulty");
let valorDifficulty = document.querySelector(".valorDifficulty");
let containerValorDifficulty = document.querySelector(".containerValorDifficulty");
let pageBanner = document.querySelector(".page-banner");
let inputColor = document.querySelector(".inputColor");
let inputUser = document.querySelector(".inputUser");
let nameUser = document.querySelector(".nameUser");
let ContentPlay = document.querySelector(".ContentPlay");
const audioInicio = new Audio("sounds/inicio.mp3");
const audioJazz = new Audio("sounds/jazz.mp3");
const audiofinal = new Audio("sounds/final.mp3");
const audioCaja = new Audio("sounds/caja.mp3");
const correcto = new Audio("sounds/correcto.mp3");
const incorrecto = new Audio("sounds/incorrecto.mp3");
const audioRuleta = new Audio("sounds/ruleta.mp3");
let validateName = document.querySelector(".validateName");
let addOpaco = document.querySelector(".addOpaco");
let btnOptions = document.querySelector(".btnOptions");
let btnReanudar = document.querySelector(".btnReanudar");
let reiniciarJuego = document.querySelector(".reiniciarJuego");

//Evento que asigna el color de fondo del juego
inputColor.addEventListener("change", () => {
  pageBanner.style.backgroundColor = inputColor.value;
});

// evento que genera el número de cajas
if (iniciarCaja) {

  // Lista los datos en la tabla de clasificación
  getDataLocalStorage('boxGame');

  iniciarCaja.addEventListener("click", () => {

    if (inputUser.value == "") {
      errorSecondary(validateName, "Completa el campo");
    } else {

      let score = 0;

      reiniciarJuego.style.display = "block";
      audioInicio.play();
      successSecondary(validateName);

      ContentPlay.style.display = ("none");
      selectDifficulty.style.display = ("none");
      containerValorDifficulty.style.display = "block";
      nameUser.textContent = inputUser.value;

      if (selectDifficulty.value == 6) {
        valorDifficulty.textContent = "Facil";
      } else if (selectDifficulty.value == 8) {
        valorDifficulty.textContent = "Mediana";
      } else {
        valorDifficulty.textContent = "Dificil";
      }

      ContentPlay.insertAdjacentHTML("afterend", `<div class="row padding-caja numberCajas justify-content-center align-items-center h-100" style="margin-top:60px"></div>`);

      let numberCajas = document.querySelector(".numberCajas");
      numberCajas.insertAdjacentHTML("beforeend", ` <div class="col-md-12 text-center">
          <h2>Toca una caja para abrirla</h2>
        </div>`);

      for (let i = 0; i < selectDifficulty.value; i++) {
        numberCajas.insertAdjacentHTML("beforeend", ` <div class="col-md-3 col-6 abrirModal">

            <div class="content-caja">
              <div class="img-caja" style="position: relative;">
                <img class="caja" src="img/caja.png" alt="">
                <img class="caja-black" src="img/caja-black.png" alt="">
                <span class="numCaja h2 ">`+ [i + 1] + `</span>
               
              </div>
              <div class="posicion-icono-juego">
              <i class="agreagrIcono"></i>
            </div>
            </div>
          </div>`);
      }

      // Se obtienen todas las cajas
      let abrirModal = document.querySelectorAll(".abrirModal");

      for (let i = 0; i < abrirModal.length; i++) {
        let caja = abrirModal[i].querySelector(".img-caja");
        let agreagrIcono = abrirModal[i].querySelector(".agreagrIcono");
        let posicionIconoJuego = abrirModal[i].querySelector(".posicion-icono-juego");

        // evento de abrir caja modal y obciones de respuesta e la caja
        caja.addEventListener("click", () => {

          addModal(abrirModal[i], i);
          let modal = document.querySelector('.modal-shoppingCart');
          let romanNum = modal.querySelector('.numCaja-number');

          // Mandar una cantidad diferente dependiendo de la dificultad
          let answerNum = randomNumber(1, 100);
          romanNum.textContent = convertToRoman(answerNum);

          audioCaja.play();
          correcto.load();

          let positionCorrectAnswer = randomNumber(0, 4);

          let optionModalHijo = modal.querySelectorAll(".option-modal-hijo");
          for (let j = 0; j < optionModalHijo.length; j++) {

            let buttonOption = optionModalHijo[j];
            buttonOption.style.backgroundColor = inputColor.value;

            // Comprobar que todos las opciones son diferentes. Hacerlo con find o some

            // Se reemplaza el valor de la opción
            let option = buttonOption.querySelector('.option-modal-respuesta > span');
            if (j !== positionCorrectAnswer) {
              // Verificar que el número que se obtiene acá es diferente a la respuesta. Si algo sumarle una cantidad

              // Mandar una cantidad diferente dependiendo de la dificultad
              option.textContent = randomNumber(1, 100);
            } else {
              option.textContent = answerNum;
            }

            // Se agrega el evento al button
            buttonOption.addEventListener("click", () => {

              modal.remove();
              caja.classList.add("desabledd");
              audioCaja.load();

              // Se comprueba si la respuesta fue correcta o no
              if (Number(option.textContent) === answerNum) {
                correcto.play();
                agreagrIcono.classList.add("icofont-check-circled");
                posicionIconoJuego.classList.add("color-success");
                score++;
              } else {
                incorrecto.play();
                agreagrIcono.classList.add("icofont-close-circled");
                posicionIconoJuego.classList.add("color-danger");
              }

              // Comprueba si todos los botones están desactivados
              let desabledd = document.querySelectorAll(".desabledd");
              if (desabledd.length == abrirModal.length) {

                audiofinal.play();
                numberCajas.remove();

                // Se guarda el usuario o se modifica en el localStorage
                let objData = {
                  name: inputUser.value,
                  difficulty: valorDifficulty.textContent,
                  score
                }

                saveToLocalStorage('boxGame', objData);
                // Se agregan los datos a la tabla de clasificación;
                getDataLocalStorage('boxGame');

                // Se reemplazan los textos de la pantalla final
                let str = score === Number(selectDifficulty.value)
                  ? '¡Felicitaciones!'
                  : 'Sigue participando';

                ContentPlay.insertAdjacentHTML("afterend", `<div class="row containerFinich justify-content-center align-items-center h-100" style="margin-top:140px">
                                <div class="col-md-12 text-center">
                                  <h2 class="mb-4">${str}</h2>
                                  <h5><span class="nameFinich" style="color: #333;font-weight: 600;"></span><span> tu puntaje es:</span></h5>
                                  <h1 style="color: #6C55F9;">${score}</h1><span> Puntos</span>
                                  <div>
                                    <button type="button" class="mt-5 btn-menu icon-actualizar">
                                      <i class="icofont-refresh"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>`);

                let nameFinich = document.querySelector(".nameFinich");
                nameFinich.textContent = inputUser.value;
                let containerFinich = document.querySelector(".containerFinich");
                let iconActualizar = document.querySelector(".icon-actualizar");
                iconActualizar.addEventListener("click", () => {
                  audiofinal.load();
                  if (numberCajas) {
                    numberCajas.remove();
                    ContentPlay.style.display = ("flex");
                    selectDifficulty.style.display = ("flex");
                    containerValorDifficulty.style.display = "none";
                    reiniciarJuego.style.display = "none";
                    addOpaco.classList.remove("opaco");

                  }

                  containerFinich.remove();

                });
                reiniciarJuego.addEventListener("click", () => {
                  containerFinich.remove();
                });

              }

            });
          }
        });
      }

      //eventos de reiniciar juegos
      reiniciarJuego.addEventListener("click", () => {

        if (numberCajas) {
          numberCajas.remove();
          ContentPlay.style.display = ("flex");
          selectDifficulty.style.display = ("flex");
          containerValorDifficulty.style.display = "none";
          reiniciarJuego.style.display = "none";
          addOpaco.classList.remove("opaco");

        }
      });
    }

  });
}

let sonidoin = document.querySelector(".sonidoin");
let sonidooff = document.querySelector(".sonidooff");
let completePantalla = document.querySelector(".completePantalla");
let contraerPantalla = document.querySelector(".contraerPantalla");

let noSound = document.querySelector(".noSound");
let yesSound = document.querySelector(".yesSound");
let completa = document.querySelector(".completa");
let contraer = document.querySelector(".contraer");

//evento de quitar el sonido
noSound.addEventListener("click", () => {
  audioInicio.volume = 0;
  audioCaja.volume = 0;
  correcto.volume = 0;
  incorrecto.volume = 0;
  audiofinal.volume = 0;
  audioJazz.volume = 0;
  audioRuleta.volume = 0;
  sonidoin.style.display = "none";
  sonidooff.style.display = "block";
});

//evento de colocar el sonido
yesSound.addEventListener("click", () => {
  audioInicio.volume = 1;
  audioCaja.volume = 1;
  correcto.volume = 1;
  incorrecto.volume = 1;
  audiofinal.volume = 1;
  audioJazz.volume = 1;
  audioRuleta.volume = 1;
  sonidooff.style.display = "none";
  sonidoin.style.display = "block";

});

// eventos para la pantalla completa del juego aumentar y contraer
completePantalla.addEventListener("click", () => {
  var scrollCompleta = document.getElementById("scrollCompleta");

  if (scrollCompleta.requestFullscreen) {
    scrollCompleta.requestFullscreen();
  }
  completa.style.display = "none";
  contraer.style.display = "block";

});

contraerPantalla.addEventListener("click", () => {

  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
  completa.style.display = "block";
  contraer.style.display = "none";

});

//evento de quitar lo opaco del juego
addOpaco.addEventListener("click", () => {
  addOpaco.classList.remove("opaco");
});

//evento de opciones del juego
btnOptions.addEventListener("click", () => {
  addOpaco.classList.add("opaco");
  console.log("opciones");
})


//evento de quitar la pantalla completa conn el boton esc
document.addEventListener('keydown', (event) => {
  const keyName = event.key;
  if (keyName == "Escape") {
    completa.style.display = "block";
    contraer.style.display = "none";
  }

});

//evento de reaunar el juego
btnReanudar.addEventListener("click", () => {
  addOpaco.classList.remove("opaco");
});

// funciones
//successSecondary(validateName);


function addactualizarJuego() {
  audiofinal.play();

  let containerFinich = document.querySelector(".containerFinich");
  let nameFinich = document.querySelector(".nameFinich");
  nameFinich.textContent = inputUser.value;

  let iconActualizar = document.querySelector(".icon-actualizar");
  iconActualizar.addEventListener("click", () => {
    audiofinal.load();
    ContentPlay.style.display = ("flex");
    selectDifficulty.style.display = ("flex");
    containerValorDifficulty.style.display = "none";
    reiniciarJuego.style.display = "none";
    addOpaco.classList.remove("opaco");
    containerFinich.remove();

  });

  reiniciarJuego.addEventListener("click", () => {
    containerFinich.remove();
  });
}

function reiniciaJuegos(evento, sonido) {
  reiniciarJuego.addEventListener("click", () => {
    if (sonido) {
      sonido.load();
    }
    evento.remove();
    ContentPlay.style.display = ("flex");
    selectDifficulty.style.display = ("flex");
    containerValorDifficulty.style.display = "none";
    reiniciarJuego.style.display = "none";
    addOpaco.classList.remove("opaco");

  })
}


function errorSecondary(id, message) {
  id.classList.add("error");
  let small = id.querySelector('small');
  small.innerText = message;
}

function successSecondary(id, input) {
  id.classList.remove("error");
  let small = id.querySelector('small');
  small.innerText = "";
}

function closeModalShoppingCart() {

  addOpaco.classList.remove("opaco");
  modal.classList.remove("is-visible");
  modalOpaco.classList.remove("is-visible");
  dialog.classList.remove("is-visible-dialog");
}

function saveToLocalStorage(itemName, objData) {

  let gameData = window.localStorage.getItem(itemName);
  if (!gameData) {
    window.localStorage.setItem(itemName, JSON.stringify([objData]));
  } else {
    let arrData = JSON.parse(gameData),
      indexUser = arrData.findIndex((user) =>
        user.name.toLowerCase() === objData.name.toLowerCase());

    if (indexUser === -1) {
      arrData.push(objData);
    } else {
      arrData[indexUser] = objData;
    }
    window.localStorage.setItem(itemName, JSON.stringify(arrData));
  }
}

function getDataLocalStorage(item) {

  let tableBody = document.querySelector('table > tbody');
  tableBody.innerHTML = '';
  let arrData = JSON.parse(window.localStorage.getItem(item));
  if (arrData) {
    arrData = arrData.sort((a, b) => b.score - a.score);
    arrData.forEach((user, i) => {

      const { name, difficulty, score } = user;
      let tableRow = document.createElement('tr');
      let td = '';
      td += `<td class="font-weight-bold">${i + 1}</td>
    <td>${name}</td>
    <td>${difficulty}</td>
    <td>${score}</td>
    `
      tableRow.innerHTML = td;
      tableBody.appendChild(tableRow);
    });
  }
}

function addModal(abrirModal, i) {
  abrirModal.insertAdjacentHTML("beforebegin", `      

    <div class="modal-shoppingCart" style="position: absolute;">
      <div class="opacity-modal">

      </div>
      <div class="modal-dialog modal-dialog-scrollable" style="width: 900px;">
        <div class="modal-content">
          <div class="modal-header align-middle">
            <h5 class="modal-title" title="text-center">Seleccione la opcion correcta</h5>
            <!--<a id="closess" type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></a>-->
          </div>

            <div class="modal-body">
              <div class="row">
                <div class="col-md-4 text-center">
                  <div class="option-modal-padre mt-1 mb-4">
                    <button  type="button" class="option-modal-hijo">
                      <div class="mr-3 option-modal-letra">
                        <span>A</span>
                      </div>
                      <div class="option-modal-respuesta">
                        <span>1234</span>
                      </div>
                    </button>
                  </div>
                  <div class="option-modal-padre">
                    <button  type="button" class="option-modal-hijo">
                      <div class="mr-3 option-modal-letra">
                        <span>B</span>
                      </div>
                      <div class="option-modal-respuesta">
                        <span>1234</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div class="col-md-4 text-center">
                  <div class="box-img-modal">
                    <span class="numCaja-number h1">XXII</span>
                    <img src="img/caja-open.png" alt="">
                    <span class="numCaja-open h2 ">`+ [i + 1] + `</span>
                  </div>
                </div>

                <div class="col-md-4 text-center">
                  <div class="option-modal-padre mt-1 mb-4">
                    <button  type="button" class="option-modal-hijo">
                      <div class="mr-3 option-modal-letra">
                        <span>C</span>
                      </div>
                      <div class="option-modal-respuesta">
                        <span>1234</span>
                      </div>
                    </button>
                  </div>
                  <div class="option-modal-padre">
                    <button  type="button" class="option-modal-hijo">
                      <div class="mr-3 option-modal-letra">
                        <span>D</span>
                      </div>
                      <div class="option-modal-respuesta">
                        <span>1234</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <!--<div class="modal-footer">
              <div class="container text-center">
                <button type="button" class="btn btn-primary btn-cancelar">Volver</button>
              </div>
            </div>-->
        </div>
      </div>
    </div>`)
}

function addKahoot(ContentPlay) {

  ContentPlay.insertAdjacentHTML("afterend", ` 
  <div class="card-body-juego juego-kahoot">
  <div class="row numberCajas justify-content-center align-items-center h-100" style="margin-top:60px">
    <div class="col-md-12 text-right">
      <P class="p1"><span class="text-primary b" id="counterAnswers" >1</span> de <span class="items"></span></P>
    </div>

    <div class="col-md-12 text-center">
      <h3 id="question">Al colocar el símbolo I a la izquierda de V o X, éste le:</h3>
    </div>
  </div>

  <style>
    #optionsKahoot .col-md-6 {
      padding-right: 5px;
      padding-left: 5px;
    }
  </style>


  <div class="row numberCajas justify-content-center align-items-center h-100" id="optionsKahoot">
    <div class="col-md-6 col-6" style="position: absolute; bottom: 158px; left: 0px;">
      <div class="evento-mayor">
        <div class="content-respuesta-padre-kahoot" style=" background-color: #ff4e4e;">
          <div class="content-respuesta-text-kahoot">
            <div class="mr-4 simbolo-kahoot">
              <img src="img/triangolo.png" alt="">
            </div>
            <div class="respuesta-kahoot">
              <span>Resta su valor</span>
            </div>
          </div>
          <div class="posicion-icono-juego">
            <i class="agreagrIcono"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-6 col-6" style="position: absolute; bottom: 60px; left: 0px;">
      <div class="evento-mayor">
        <div class="content-respuesta-padre-kahoot" style=" background-color: #4ec1ff;">
          <div class="content-respuesta-text-kahoot">
            <div class="mr-4 simbolo-kahoot">
              <img src="img/circulo.png" alt="">
            </div>
            <div class="respuesta-kahoot">
              <span>Suma su valor</span>
            </div>
          </div>
          <div class="posicion-icono-juego">
            <i class="agreagrIcono"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-6 col-6" style="position: absolute; bottom: 158px; right: 0px;">
      <div class="evento-mayor">
        <div class="content-respuesta-padre-kahoot" style=" background-color: #fff34e;">
          <div class="content-respuesta-text-kahoot">
            <div class="mr-4 simbolo-kahoot">
              <img src="img/rombo.png" alt="">
            </div>
            <div class="respuesta-kahoot">
              <span>Multiplica la expresión por mil</span>
            </div>
          </div>
          <div class="posicion-icono-juego">
            <i class="agreagrIcono"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-6 col-6" style="position: absolute; bottom: 60px; right: 0px;">
      <div class="evento-mayor">
        <div class="content-respuesta-padre-kahoot" style=" background-color: #4eff7a;">
          <div class="content-respuesta-text-kahoot">
            <div class="mr-4 simbolo-kahoot">
              <img src="img/cuadrado.png" alt="">
            </div>
            <div class="respuesta-kahoot">
              <span>Ninguna de las anteriores</span>
            </div>
          </div>
          <div class="posicion-icono-juego">
            <i class="agreagrIcono"></i>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>`);
}

function addMayor(ContentPlay) {
  ContentPlay.insertAdjacentHTML("afterend", `        <div class="card-body-juego juego-mayor">
  <div class="row numberCajas justify-content-center align-items-center h-100" style="margin-top:60px">
    <div class="col-md-12 text-right">
      <p class="p1"><span class="text-primary b" id="currentQuestion">1</span> de <span class="items"></span></p>
    </div>

    <div class="col-md-12 text-center">
      <h1 style="font-size: 70px;">¿Cuál número es <br> mayor?</h1>
      <!-- 
<i class="icofont-thin-left" style="font-weight: 700; font-size: 50px;"></i> -->
    </div>
  </div>

  <div class="row numberCajas justify-content-center align-items-center h-100">
    <div class="col-md-6 col-6" style="position: absolute; bottom: 60px; left: 0px;">
      <div class="evento-mayor">
        <div class="content-respuesta-padre-mayor" style=" background-color: #4ec1ff;">
          <div class="content-respuesta-text-mayor">
            <div class="mr-4 simbolo-mayor">
              <span>A</span>
            </div>
            <div class="text-center respuesta-mayor">
             <span id="optionA">XVIII</span>
            </div>
          </div>
          <div class="posicion-icono-juego">
            <i class="agreagrIcono"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6 col-6" style="position: absolute; bottom: 60px; right: 0px;">
      <div class="evento-mayor">
        <div class="content-respuesta-padre-mayor" style=" background-color: #ff4e4e;">
          <div class="content-respuesta-text-mayor">
            <div class="mr-4 simbolo-mayor">
              <span>B</span>
            </div>
            <div class="text-center respuesta-mayor">
             <span id="optionB">V</span>
            </div>
          </div>
          <div class="posicion-icono-juego">
            <i class="agreagrIcono"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`);

}

function addMessageFinich(ContentPlay, str, score) {
  ContentPlay.insertAdjacentHTML("afterend", `         <div class="row containerFinich justify-content-center align-items-center h-100" style="margin-top:140px">
  <div class="col-md-12 text-center">
    <h2 class="mb-4">${str}</h2>
    <h5><span class="nameFinich" style="color: #333;font-weight: 600;"></span><span> tu puntaje es:</span></h5>
    <h1 style="color: #6C55F9;">${score}</h1><span> Puntos</span>
    <div>
      <button type="button" class="mt-5 btn-menu icon-actualizar">
        <i class="icofont-refresh"></i>
      </button>
    </div>
    
  </div>
</div>`);
}

const map = {
  M: 1000,
  CM: 900,
  D: 500,
  CD: 400,
  C: 100,
  XC: 90,
  L: 50,
  XL: 40,
  X: 10,
  IX: 9,
  V: 5,
  IV: 4,
  I: 1
}

function convertToRoman(num) {
  let result = '';
  for (const key in map) {
    result += key.repeat(Math.floor(num / map[key]));
    // Se va disminuyendo por cada iteración hasta llegar a 0
    num = num % map[key];
  }
  return result;
}

function randomNumber(minNum, maxNum) {
  return Math.floor(Math.random() * (maxNum - minNum) + minNum);
}

