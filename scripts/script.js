import L from 'leaflet';

var aValizas = JSON.parse(sValizas);

var Mapa = L.map('map').setView([43.34578351332376, -1.7965434243182008],11);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18}).addTo(Mapa);

for(i=0;i < aValizas.length;i++){
    var Valizas = L.marker([aValizas[i].GpxY, aValizas[i].GpxX]).addTo(Mapa);
    Valizas.bindPopup(`<b>${aValizas[i].Nombre}</b>`).openPopup();
}




