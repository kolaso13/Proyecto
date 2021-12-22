import L from 'leaflet';

var aValizas = JSON.parse(sValizas);

var aValizas = L.map('map').setView([43.34578351332376, -1.7965434243182008],11);
document.getElementById("Miubicacion").addEventListener("click",function(){
if("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(function(position) {
        map.setView([position.coords.latitude, position.coords.longitude],14);
      });
}})

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',maxZoom: 18}).addTo(map);

var Irun = L.marker([43.337980156287806, -1.7889131039719477]).addTo(map);
Irun.bindPopup("<b>Irun</b><br>Ofertas Irun").openPopup();

