import L from 'leaflet';

//Declaramos las variables
aValizas = JSON.parse(sValizas);
var aId = new Array();
var aMarcadores = new Array();
var bexiste;
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
for (i = 0; i < aValizas.length; i++) {
    var Valizas = L.marker([aValizas[i].GpxY, aValizas[i].GpxX], { idMarcador: aValizas[i].Id }).addTo(Mapa);
    Valizas.bindPopup(`${aValizas[i].Nombre}`);
    Valizas.on("click", Agregar);
    aMarcadores.push(Valizas);
}

RevisarLocalStorage();

//Funcion que agrega un div cuando se hace clic en un marcador
function Agregar(e) {
    var sImprimirDiv = "";

    //Cogemos el id de las balizas
    var sObtenerNombre = e.target.getPopup().getContent();
    console.log(sObtenerNombre);

    for (i = 0; i < aValizas.length; i++) {
        if (sObtenerNombre == aValizas[i].Nombre) {
            var sObtenerID = aValizas[i].Id;
            break;
        }
    }
    //Comprobamos que el ID seleccionado no esta ya
    if (aId.length < 4) {
        for (i = 0; i < aId.length; i++) {
            if (aId[i] == sObtenerID) {
                bexiste = true;
                break;
            }
            else {
                bexiste = false;
            }
        }

        console.log(sObtenerID);

        localStorage.setItem(sObtenerID, sObtenerNombre);
        //Si no existe imprimimos una tarjeta y añadimos al array de los IDs el nuevo
        if (!bexiste) {
            //Cambiamos el color
            e.target.setIcon(BlackIcon);
            aId.push(sObtenerID);
            for (i = 0; i < aValizas.length; i++) {
                if (aValizas[i].Id == sObtenerID) {
                    sID = aValizas[i].Id;
                    sImprimirDiv += `<div class="tarjetas col" id="${sID}">
                                <button type="button" class="btn-close btncerrar" aria-label="Close"></button>
                                <h4>${aValizas[i].Nombre}</h4>
                                <div class="divsDatos" id="TemperaturaOculto">
                                    <p>Temperatura:</p>
                                </div>
                                <div class="divsDatos" id="HumedadOculto">
                                    <p>Humedad:</p>
                                </div>
                                <div class="divsDatos" id="LluviaOculto">
                                    <p>Precipitación:</p>
                                </div>
                                <div class="divsDatos" id="VientoOculto">
                                    <p>Velocidad del Viento:</p>
                                </div>
                                
                            </div>`;
                }
            }
            document.getElementById("Contenido").innerHTML += sImprimirDiv;
        }
    }
    Jquery();
}

function Jquery(){
    //Eliminar el div al hacer click en la x
    $(".btn-close").click(function (e) {
        var id = e.target.closest(".tarjetas").id;
        localStorage.removeItem(id);
        for (i = 0; i < aId.length; i++) {
            if (aId[i] == id) {
                aId.splice(i, 1);
                console.log("Borrado");

            }
        }
        for (i = 0; i < aMarcadores.length; i++) {
            if (aMarcadores[i].options.idMarcador == id) {
                aMarcadores[i].setIcon(BlueIcon);
                console.log("Cambio");
            }
        }
        $(this).closest(".tarjetas").remove();
    })
    $(function () {
        $("#Contenido").sortable();
    });

    //Hacemos los filtros draggables
    $(function () {
        $(".icono").draggable({ revert: "valid", revert: true });

        $(".tarjetas").droppable({
            classes: {
                "ui-droppable-active": "ui-state-active",
                "ui-droppable-hover": "ui-state-hover"
            },
            drop: function (event, ui) {
                var idFiltros = ui.draggable.attr("id").substring(1);
                console.log(idFiltros);
                $(this).find(`#${idFiltros}Oculto`).addClass("Mostrar");
            }
        });
    });
}

function RevisarLocalStorage() {
    var sImprimirLocalStorage = "";
    allaves = Object.keys(localStorage);
    var aNombre = new Array();

    for (i = 0; i < allaves.length; i++) {
        for (j = 0; j < aValizas.length; j++) {
            if (aValizas[j].Id == allaves[i]) {
                aNombre[i] = aValizas[j].Nombre;
            }
        }
    }
    console.log(aNombre);

    for (i = 0; i < allaves.length; i++) {
        sImprimirLocalStorage += `<div class="tarjetas col" id="${allaves[i]}">
                                <button type="button" class="btn-close btncerrar" aria-label="Close"></button>
                                <h4>${aNombre[i]}</h4>
                                <div class="divsDatos" id="TemperaturaOculto">
                                    <p>Temperatura:</p>
                                </div>
                                <div class="divsDatos" id="HumedadOculto">
                                    <p>Humedad:</p>
                                </div>
                                <div class="divsDatos" id="LluviaOculto">
                                    <p>Precipitación:</p>
                                </div>
                                <div class="divsDatos" id="VientoOculto">
                                    <p>Velocidad del Viento:</p>
                                </div>
                            </div>`;
    }
    document.getElementById("Contenido").innerHTML += sImprimirLocalStorage;
    Jquery();
}
