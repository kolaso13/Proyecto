import L from 'leaflet';

//Declaramos las variables
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

var RedIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var YellowIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var GreenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
ObtencionDeDatosAPI();

function ObtencionDeDatosAPI() {

    fetch("https://localhost:5001/api/Tiempo").then(response => response.json()).then(aBalizas => {
        console.log("lo siguiente es aBalizas");
        console.log(aBalizas);
        CrearBalizas();
        function CrearBalizas() {
            //Creamos la balizas
            for (var i = 0; i < aBalizas.length; i++) {
                var Balizas = L.marker([aBalizas[i].gpxY, aBalizas[i].gpxX], { idMarcador: aBalizas[i].id, Provincia: aBalizas[i].provincia }).addTo(Mapa);
                Balizas.bindPopup(`${aBalizas[i].nombre}`);
                Balizas.on("click", Agregar);


                if (aBalizas[i].tipoEstacion == "BUOY") {
                    Balizas.setIcon(RedIcon);
                } else if (aBalizas[i].tipoEstacion == "METEOROLOGICAL") {
                    Balizas.setIcon(BlueIcon);
                } else if (aBalizas[i].tipoEstacion == "GAUGING") {
                    Balizas.setIcon(YellowIcon);
                } else {
                    Balizas.setIcon(GreenIcon);
                }

                aMarcadores.push(Balizas);
            }
        }
        //Funcion que agrega un div cuando se hace clic en un marcador
        function Agregar(e) {
            console.log("Es el this " + e);
            var sImprimirDiv = "";

            //Cogemos el nombre de las balizas
            var sObtenerNombre = e.target.getPopup().getContent();
            console.log(sObtenerNombre);

            //Con el nombre cogemos el id
            for (i = 0; i < aBalizas.length; i++) {
                if (sObtenerNombre == aBalizas[i].nombre) {
                    var sObtenerID = aBalizas[i].id;
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
                    localStorage.IDs = JSON.stringify(aId);

                    for (i = 0; i < aBalizas.length; i++) {
                        if (aBalizas[i].id == sObtenerID) {
                            var sID = aBalizas[i].id;
                            sImprimirDiv += `<div class="tarjetas col" id="${sID}">
                                                    <button type="button" class="btn-close btncerrar" aria-label="Close"></button>
                                                    <h4>${aBalizas[i].nombre}</h4>
                                                    <div id="contenedorDatos">
                                                        <div class="divsDatos MostrarPrincipio" id="TemperaturaOculto">
                                                            <h3>Temperatura</h3>`;
                            if (aBalizas[i].temperatura == "Sin datos") {
                                sImprimirDiv += `<p id="DatosObtenidos">${aBalizas[i].temperatura}</p>`;
                            } else {
                                sImprimirDiv += `<p id="DatosObtenidos">${aBalizas[i].temperatura} °C</p>`;
                            }
                            sImprimirDiv += `</div>
                                                        <div class="divsDatos MostrarPrincipio" id="HumedadOculto">
                                                            <h3>Humedad</h3>`;
                            if (aBalizas[i].humedad == "Sin datos") {
                                sImprimirDiv += `<p id="DatosObtenidos">${aBalizas[i].humedad}</p>`;
                            } else {
                                sImprimirDiv += `<p id="DatosObtenidos">${aBalizas[i].humedad} %</p>`;
                            }
                            sImprimirDiv += `</div>
                                                        <div class="divsDatos" id="LluviaOculto">
                                                            <h3>Precipitación</h3>`;
                            if (aBalizas[i].precipitacion == "Sin datos") {
                                sImprimirDiv += `<p id="DatosObtenidos">${aBalizas[i].precipitacion}</p>`;
                            } else {
                                sImprimirDiv += `<p id="DatosObtenidos">${aBalizas[i].precipitacion} mm=l/m²</p>`;
                            }
                            sImprimirDiv += `</div>
                                                        <div class="divsDatos" id="VientoOculto">
                                                            <h3>Velocidad del Viento</h3>`;
                            if (aBalizas[i].viento == "Sin datos") {
                                sImprimirDiv += `<p id="DatosObtenidos">${aBalizas[i].viento}</p>`;
                            } else {
                                sImprimirDiv += `<p id="DatosObtenidos">${aBalizas[i].viento} km/h</p>`;
                            }
                            sImprimirDiv += `
                                                        </div>
                                                    </div>
                                                </div>`;
                        }
                    }
                    document.getElementById("Contenido").innerHTML += sImprimirDiv;
                }
            }
            Jquery(aBalizas);
        }
        var sImprimirSelect = `<select id="select" name="select">
                        <option value="Todos">Todos</option>
                        <option value="Bizkaia">Bizkaia</option>
                        <option value="Gipuzkoa">Gipuzkoa</option>
                        <option value="Álava">Álava</option>
                        </select>
                        `;
        document.getElementById("Provincias").innerHTML = sImprimirSelect;
        console.log(aMarcadores);
        $("select").on("change", function () {
            var sProvinciaSeleccionada = document.getElementById("select").value;
            aMarcadores.forEach(i => {
                Mapa.removeLayer(i);
            });
            aMarcadores = [];
            if (sProvinciaSeleccionada == "Todos") {
                CrearBalizas();
            } else {
                for (let i = 0; i < aBalizas.length; i++) {
                    if (aBalizas[i].provincia == sProvinciaSeleccionada) {
                        let Balizas = L.marker([aBalizas[i].gpxY, aBalizas[i].gpxX], { idMarcador: aBalizas[i].id }).bindPopup(`${aBalizas[i].nombre}`).addTo(Mapa);
                        Balizas.on("click", Agregar);
                        if (aBalizas[i].tipoEstacion == "BUOY") {
                            Balizas.setIcon(RedIcon);
                        } else if (aBalizas[i].tipoEstacion == "METEOROLOGICAL") {
                            Balizas.setIcon(BlueIcon);
                        } else if (aBalizas[i].tipoEstacion == "GAUGING") {
                            Balizas.setIcon(YellowIcon);
                        } else {
                            Balizas.setIcon(GreenIcon);
                        }
                        aMarcadores.push(Balizas);

                    } else {
                        let Balizas = L.marker([aBalizas[i].gpxY, aBalizas[i].gpxX], { idMarcador: aBalizas[i].id }).bindPopup(`${aBalizas[i].nombre}`);
                        if (aBalizas[i].tipoEstacion == "BUOY") {
                            Balizas.setIcon(RedIcon);
                        } else if (aBalizas[i].tipoEstacion == "METEOROLOGICAL") {
                            Balizas.setIcon(BlueIcon);
                        } else if (aBalizas[i].tipoEstacion == "GAUGING") {
                            Balizas.setIcon(YellowIcon);
                        } else {
                            Balizas.setIcon(GreenIcon);
                        }
                        aMarcadores.push(Balizas);

                    }
                }

            }
            //Cambiamos la baliza a color negro
            for (i = 0; i < aId.length; i++) {
                for (j = 0; j < aMarcadores.length; j++) {
                    if (aMarcadores[j].options.idMarcador == aId[i]) {
                        aMarcadores[j].setIcon(BlackIcon);
                    }
                }
            }
        });
        RevisarLocalStorage(aBalizas);
    })
};
$(document).ready(function () {
    $("svg").on("click", function () {
        $("#Provincias").slideToggle(750);
        $("#map").slideToggle(750);
        $("#colores").slideToggle(750);
    });
});
function Jquery(aBalizas) {

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
        localStorage.IDs = JSON.stringify(aId);

        //Cambiamos el icono negro por el azul cuando se cierra la tarjeta
        for (i = 0; i < aMarcadores.length; i++) {
            if (aMarcadores[i].options.idMarcador == id) {
                if (aBalizas[i].tipoEstacion == "BUOY") {
                    aMarcadores[i].setIcon(RedIcon);
                } else if (aBalizas[i].tipoEstacion == "METEOROLOGICAL") {
                    aMarcadores[i].setIcon(BlueIcon);
                } else if (aBalizas[i].tipoEstacion == "GAUGING") {
                    aMarcadores[i].setIcon(YellowIcon);
                } else {
                    aMarcadores[i].setIcon(GreenIcon);
                }
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
        $(".icono").draggable({ helper: "clone" });

        //Al soltar los iconos en las tarjetas se añade el parametro correspondiente
        $(".tarjetas").droppable({
            drop: function (event, ui) {
                var idFiltros = ui.draggable.attr("id").substring(1);
                console.log(idFiltros);

                if (idFiltros == "Papelera") {
                    $(this).find(`#TemperaturaOculto`).removeClass("Mostrar");
                    $(this).find(`#HumedadOculto`).removeClass("Mostrar");
                    $(this).find(`#LluviaOculto`).removeClass("Mostrar");
                    $(this).find(`#VientoOculto`).removeClass("Mostrar");
                }
                else {
                    $(this).find(`#${idFiltros}Oculto`).addClass("Mostrar");
                }
            }
        });
    });
}

//Funcion que  mira en el storage para crear tarjetas al crear la pagina
function RevisarLocalStorage(aBalizas) {
    document.getElementById("Contenido").innerHTML="";
    var sImprimirLocalStorage = "";
    var aNombre = new Array();
    if (localStorage.IDs == undefined) {
        IDs = [];
        var allaves= new Array();
    } else {
        //Cogemos el array del localstorage
        var allaves = JSON.parse(localStorage.IDs);
    }

    //Cogemos el nombre de la baliza con el id guardado en el storage
    for (i = 0; i < allaves.length; i++) {
        for (var j = 0; j < aBalizas.length; j++) {
            if (aBalizas[j].id == allaves[i]) {
                aNombre[i] = aBalizas[j].nombre;
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

    //Creamos las tarjetas segun el storage
    console.log(aId);
    for (i = 0; i < allaves.length; i++) {
        for (j = 0; j < aBalizas.length; j++) {
            if (aBalizas[j].id == allaves[i]) {
                sImprimirLocalStorage += `<div class="tarjetas col" id="${allaves[i]}">
                                            <button type="button" class="btn-close btncerrar" aria-label="Close"></button>
                                            <h4>${aBalizas[j].nombre}</h4>
                                            <div class="divsDatos MostrarPrincipio" id="TemperaturaOculto">
                                                <h3>Temperatura</h3>`;
                if (aBalizas[j].temperatura == "Sin datos") {
                    sImprimirLocalStorage += `<p id="DatosObtenidos">${aBalizas[j].temperatura}</p>`;
                } else {
                    sImprimirLocalStorage += `<p id="DatosObtenidos">${aBalizas[j].temperatura} °C</p>`;
                }
                sImprimirLocalStorage += `</div>
                                        <div class="divsDatos MostrarPrincipio" id="HumedadOculto">
                                            <h3>Humedad</h3>`;
                if (aBalizas[j].humedad == "Sin datos") {
                    sImprimirLocalStorage += `<p id="DatosObtenidos">${aBalizas[j].humedad}</p>`;
                } else {
                    sImprimirLocalStorage += `<p id="DatosObtenidos">${aBalizas[j].humedad} %</p>`;
                }
                sImprimirLocalStorage += `</div>
                                        <div class="divsDatos" id="LluviaOculto">
                                            <h3>Precipitación</h3>`;
                if (aBalizas[j].precipitacion == "Sin datos") {
                    sImprimirLocalStorage += `<p id="DatosObtenidos">${aBalizas[j].precipitacion}</p>`;
                } else {
                    sImprimirLocalStorage += `<p id="DatosObtenidos">${aBalizas[j].precipitacion} mm=l/m²</p>`;
                }
                sImprimirLocalStorage += ` </div>
                                        <div class="divsDatos" id="VientoOculto">
                                            <h3>Velocidad del Viento</h3>`;
                if (aBalizas[j].viento == "Sin datos") {
                    sImprimirLocalStorage += `<p id="DatosObtenidos">${aBalizas[j].viento}</p>`;
                } else {
                    sImprimirLocalStorage += `<p id="DatosObtenidos">${aBalizas[j].viento} km/h</p>`;
                }
                sImprimirLocalStorage += `</div>
                                    </div>`;
            }

        }
    }
    document.getElementById("Contenido").innerHTML += sImprimirLocalStorage;
    Jquery(aBalizas);
}



