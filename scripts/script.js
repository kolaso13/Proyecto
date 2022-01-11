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

for (i = 0; i < aValizas.length; i++) {
    var Valizas = L.marker([aValizas[i].GpxY, aValizas[i].GpxX]).addTo(Mapa);
    Valizas.bindPopup(`${aValizas[i].Id}`);
    Valizas.on("click", Agregar);
}

function Agregar(e) {
    var ImprimirDiv = "";

    var sObtenerID = e.target.getPopup().getContent();
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
                        .html("Dropped!");
                }
            });
        });
        document.getElementById("Contenido").innerHTML += ImprimirDiv;
    }
}


