import L from 'leaflet';

var aValizas = JSON.parse(sValizas);
var aId = new Array();
var bexiste;
var Mapa = L.map('map').setView([43.34578351332376, -1.7965434243182008], 11);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(Mapa);

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
}


