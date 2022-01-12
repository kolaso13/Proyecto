import L from 'leaflet';

var aValizas = JSON.parse(sValizas);
var aId = new Array();
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

//Creamos la balizas
for (i = 0; i < aValizas.length; i++) {
    var Valizas = L.marker([aValizas[i].GpxY, aValizas[i].GpxX]).addTo(Mapa);
    Valizas.bindPopup(`${aValizas[i].Nombre}`);
    Valizas.on("click", Agregar);
}

//Funcion que agrega un div cuando se hace clic en un marcador
function Agregar(e) {
    var ImprimirDiv = "";
    //Cogemos el id de las balizas
    var sObtenerNombre = e.target.getPopup().getContent();
    for(i = 0; i < aValizas.length; i++) {
        if(sObtenerNombre == aValizas[i].Nombre){
            var sObtenerID = aValizas[i].Id;
            break;
        }
    }
    //Comprobamos que el ID seleccionado no esta ya
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

    //Si no existe imprimimos una tarjeta y añadimos al array de los IDs el nuevo
    if (!bexiste) {
        e.target.setIcon(BlackIcon);
        aId.push(sObtenerID);
        for (i = 0; i < aValizas.length; i++) {
            if (aValizas[i].Id == sObtenerID) {
                sID = aValizas[i].Id;
                ImprimirDiv += `<div class="tarjetas col" id="opcion${sID}">
                                <p>${aValizas[i].Nombre}</p>
                            </div>`;
            }
        }
        document.getElementById("Contenido").innerHTML += ImprimirDiv;
    }

    //Hacemos los filtros draggables
    $(function () {
        $(".icono").draggable({ revert: "valid", revert: true });
        
        $(".tarjetas").droppable({
            classes: {
                "ui-droppable-active": "ui-state-active",
                "ui-droppable-hover": "ui-state-hover"
            },
            drop: function (event, ui) {
                $(this)
                    .addClass("ui-state-highlight")
                    .find("p")
                    .html("Dropped");
            }
        });
    });
}


