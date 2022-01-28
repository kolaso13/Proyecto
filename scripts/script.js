import L from 'leaflet';

//Declaramos las variables
var aBalizas = JSON.parse(sBalizas);
var aId = new Array();
var aMarcadores = new Array();
var bExiste;
var Mapa = L.map('map').setView([43.34578351332376, -1.7965434243182008], 11);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(Mapa);

var BlackIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var BlueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

//Creamos la balizas
for (var i = 0; i < aBalizas.length; i++) {
    var Balizas = L.marker([aBalizas[i].GpxY, aBalizas[i].GpxX], { idMarcador: aBalizas[i].Id }).addTo(Mapa);
    Balizas.bindPopup(`${aBalizas[i].Nombre}`);
    Balizas.on("click", Agregar);
    aMarcadores.push(Balizas);
}

RevisarLocalStorage();

//Funcion que agrega un div cuando se hace clic en un marcador
function Agregar(e) {
    var sImprimirDiv = "";

    //Cogemos el nombre de las balizas
    var sObtenerNombre = e.target.getPopup().getContent();
    console.log(sObtenerNombre);

    //Con el nombre cogemos el id
    for (i = 0; i < aBalizas.length; i++) {
        if (sObtenerNombre == aBalizas[i].Nombre) {
            var sObtenerID = aBalizas[i].Id;
            break;
        }
    }
    //Comprobamos que el ID seleccionado no esta ya
    if (aId.length < 4) {
        for (i = 0; i < aId.length; i++) {
            if (aId[i] == sObtenerID) {
                bExiste = true;
                break;
            }
            else {
                bExiste = false;
            }
        }

        console.log(sObtenerID);

        //Si no existe imprimimos una tarjeta y añadimos al array de los IDs el nuevo
        if (!bExiste) {
            //Cambiamos el color
            e.target.setIcon(BlackIcon);
            aId.push(sObtenerID);
            //Añadimos al localstorage el array
            localStorage.IDs=JSON.stringify(aId);
            
            for (i = 0; i < aBalizas.length; i++) {
                if (aBalizas[i].Id == sObtenerID) {
                    var sID = aBalizas[i].Id;
                    sImprimirDiv += `<div class="tarjetas col" id="${sID}">
                                <button type="button" class="btn-close btncerrar" aria-label="Close"></button>
                                <h4>${aBalizas[i].Nombre}</h4>
                                <div id="contenedorDatos">
                                    <div class="divsDatos MostrarPrincipio" id="TemperaturaOculto">
                                        <h3>Temperatura</h3>
                                    </div>
                                    <div class="divsDatos MostrarPrincipio" id="HumedadOculto">
                                        <h3>Humedad</h3>
                                    </div>
                                    <div class="divsDatos" id="LluviaOculto">
                                        <h3>Precipitación</h3>
                                    </div>
                                    <div class="divsDatos" id="VientoOculto">
                                        <h3>Velocidad del Viento</h3>
                                    </div>
                                </div>
                            </div>`;
                }
            }
            document.getElementById("Contenido").innerHTML += sImprimirDiv;
        }
    }
    Jquery();
}

function Jquery() {
    //Apareceran al cargar la pagina
    $(".MostrarPrincipio").addClass("Mostrar");
    //Eliminar el div al hacer click en la x
    $(".btn-close").click(function (e) {
        var id = e.target.closest(".tarjetas").id;

        //for para eliminar del array donde guardamos los IDs el id de la tarjeta que hemos cerrado
        for (i = 0; i < aId.length; i++) {
            if (aId[i] == id) {
                aId.splice(i, 1);
                console.log("Borrado");
            }
        }

        //Volvemos a subir el array con el id eliminado
        localStorage.IDs=JSON.stringify(aId);

        //Cambiamos el icono negro por el azul cuando se cierra la tarjeta
        for (i = 0; i < aMarcadores.length; i++) {
            if (aMarcadores[i].options.idMarcador == id) {
                aMarcadores[i].setIcon(BlueIcon);
                console.log("Cambio");
            }
        }
        //La clase mas cercana a la x la elimina
        $(this).closest(".tarjetas").remove();
    })

    //Funcion para poder desplazar las tarjetas
    $(function () {
        $("#Contenido").sortable();
    });


    //Hacemos los filtros draggables
    $(function () {
        //El icono volvera a su posicion
        $(".icono").draggable({ revert: "valid", revert: true });

        //Al soltar los iconos en las tarjetas se añade el parametro correspondiente
        $(".tarjetas").droppable({
            drop: function (event, ui) {
                var idFiltros = ui.draggable.attr("id").substring(1);
                console.log(idFiltros);
                
                if(idFiltros=="Papelera"){
                    $(this).find(`#TemperaturaOculto`).removeClass("Mostrar");
                    $(this).find(`#HumedadOculto`).removeClass("Mostrar");
                    $(this).find(`#LluviaOculto`).removeClass("Mostrar");
                    $(this).find(`#VientoOculto`).removeClass("Mostrar");
                }
                else{
                    $(this).find(`#${idFiltros}Oculto`).addClass("Mostrar");
                }
            }
        });
    });
}

//Funcion que  mira en el storage para crear tarjetas al crear la pagina
function RevisarLocalStorage() {
    var sImprimirLocalStorage = "";
    var aNombre = new Array();

    //Cogemos el array del localstorage
    var allaves=JSON.parse(localStorage.IDs);
    //Cogemos el nombre de la baliza con el id guardado en el storage
    for (i = 0; i < allaves.length; i++) {
        for (var j = 0; j < aBalizas.length; j++) {
            if (aBalizas[j].Id == allaves[i]) {
                aNombre[i] = aBalizas[j].Nombre;
            }
        }
    }
    //Lo añadimos al array de los ids
    for (i = 0; i < allaves.length; i++) {
        aId.push(allaves[i]);
    }
    //Cambiamos la baliza a color negro
    for (i = 0; i < aId.length; i++) {
        for (j = 0; j < aMarcadores.length; j++) {
            if (aMarcadores[j].options.idMarcador == aId[i]) {
                aMarcadores[j].setIcon(BlackIcon);
            }
        }
    }
    //Desplegar/Ocultar el mapa
    $(document).ready(function () {
        $("#escondermapa").click(function () {
            $("#map").slideToggle(750);
        });
    });
    //Creamos las tarjetas segun el storage
    console.log(aId);
    for (i = 0; i < allaves.length; i++) {
        sImprimirLocalStorage += `<div class="tarjetas col" id="${allaves[i]}">
                                <button type="button" class="btn-close btncerrar" aria-label="Close"></button>
                                <h4>${aNombre[i]}</h4>
                                <div class="divsDatos MostrarPrincipio" id="TemperaturaOculto">
                                    <h3>Temperatura</h3>
                                </div>
                                <div class="divsDatos MostrarPrincipio" id="HumedadOculto">
                                    <h3>Humedad</h3>
                                </div>
                                <div class="divsDatos" id="LluviaOculto">
                                    <h3>Precipitación</h3>
                                </div>
                                <div class="divsDatos" id="VientoOculto">
                                    <h3>Velocidad del Viento</h3>
                                </div>
                            </div>`;

    }
    document.getElementById("Contenido").innerHTML += sImprimirLocalStorage;
    Jquery();
}
ObtencionDeDatosAPI()
function ObtencionDeDatosAPI() {
    fetch("https://localhost:5001/api/Tiempo")
        .then(response => response.json())
        .then(datosTiempo => {
            console.log(datosTiempo);
            
        })
};

