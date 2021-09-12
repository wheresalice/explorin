const myMap = L.map('submitmap').fitWorld();

const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const osmAttrib = 'Map data � <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
const osm = new L.TileLayer(osmUrl, {minZoom: 2, maxZoom: 18, attribution: osmAttrib});
myMap.addLayer(osm);

let marker;
myMap.on('click', onMapClick);
function onMapClick(e) {
    if (Object.keys(myMap._layers).length > 1) {
        deleteMarker()
    }
    if (Object.keys(myMap._layers).length === 1) {
        marker = new L.marker(e.latlng, {draggable: false});
        myMap.addLayer(marker);
        marker.on("click", onMarkerClick);
        document.getElementById('pointlocation').value = JSON.stringify(marker.toGeoJSON());
    }
}

function deleteMarker() {
    myMap.removeLayer(marker);
    document.getElementById('pointlocation').value = '';
}

function onMarkerClick() {
    deleteMarker();
}

myMap.setView([35.5754390657896, 45.388114638626575], 2);
