// main layer
const Esri_WorldShadedRelief = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri',
	maxZoom: 13,
	minZoom: 0
});
const Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
const CartoDB_PositronNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
});

const map = L.map('map', {layers: [Esri_WorldShadedRelief], maxZoom: 18}).fitWorld();
const baseMaps = {
	"ESRI World Shaded": Esri_WorldShadedRelief,
}
const cheatLayer = {
	"CartoDB No Labels": CartoDB_PositronNoLabels,
	"ESRI World Imagery": Esri_WorldImagery,
}
L.control.layers(baseMaps, cheatLayer).addTo(map);

// theme the gpx data
// @todo how do we use nicer markers?
const customLayer = L.geoJson(null, {
    // http://leafletjs.com/reference.html#geojson-style
    style: function() {
        return { color: '#f00', dashArray: '4' };
    }
});

// redirect to an example gpx if one isn't provided
const url = new URL(document.URL);
let gpx = url.searchParams.get("gpx");
if (!gpx) {
    const urlParams = new URLSearchParams();
    urlParams.set('gpx', './data/paulinus_way.gpx')
    window.location.search = urlParams
}

// load the gpx data
const runLayer = omnivore.gpx(gpx, null, customLayer)
    .on('ready', function () {
        map.fitBounds(runLayer.getBounds());
        runLayer.eachLayer(function(layer) {
            // console.log(layer)
            layer.bindPopup(layer.feature.properties.name)
        })
    })
    .addTo(map);

// add a compass
map.addControl( new L.Control.Compass({autoActive: true, showDigit: true}) );
// show the coordinates
L.control.coordinates({
	position:"bottomleft",
	// decimals:2,
	decimalSeperator:".",
	markerType: L.marker, //optional default L.marker
	markerProps: {}//optional default none
}).addTo(map);
// add a scale
L.control.scale().addTo(map);
// add a button to show current location
map.addControl( new L.Control.Gps() );
// allow measuring
L.control.ruler().addTo(map);
