// Leaflet free tiles
// https://leaflet-extras.github.io/leaflet-providers/preview/
// tiles mapbox https://www.mapbox.com/api-documentation/#maps

L.mapbox.accessToken = 'pk.eyJ1IjoiYWxveGUiLCJhIjoid3lBT0poSSJ9.QvBnfWvRrXcHGUQPccVtKA';
var ownCopyright = ' et <a href="http://alix.guillard.fr">Alix Guillard</a>';

var mapbox = L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>' + ownCopyright
});

var greenbox = L.tileLayer('https://api.mapbox.com/v4/mapbox.run-bike-hike/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>' + ownCopyright
});

var pencil = L.tileLayer('https://api.mapbox.com/v4/mapbox.pencil/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>' + ownCopyright
});

var emerald = L.tileLayer('https://api.mapbox.com/v4/mapbox.emerald/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>' + ownCopyright
});

var outdoors = L.tileLayer('https://api.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>' + ownCopyright
});

//tiles osm
var hikebike = L.tileLayer('http://{s}.tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' + ownCopyright
});

// tiles topo
var topo1 = L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 16,
    attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)' + ownCopyright
});

// Esri_WorldTopoMap
var topo2 = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community' + ownCopyright
});

// Open surfer
var surfer = L.tileLayer('http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' + ownCopyright
});

// OpenMap surfer
var surfer1 = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
    maxZoom: 20,
    attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' + ownCopyright
});

// Hydra
var hydra = L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
    attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' + ownCopyright
});

// Thunderforest landscape
var landscape = L.tileLayer('http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' + ownCopyright
});

// Thunderforest outdoors
var outdoors = L.tileLayer('http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' + ownCopyright
});

// HERE Satelite
var here = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/satellite.day/{z}/{x}/{y}/256/png8?app_id=pfAhw6lDnb0sMr5AEBnP&app_code=o5uOOynx35QJsYG0k-7CWw', {
// var here = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/satellite.day/{z}/{x}/{y}/256/png8?app_id=jj3PxNTEQofGag1XJffz&app_code=DABJ44kZTSbLi8c520H_Vy-1CdIpLS_XFIT4EMdtNLo', {
    attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>' + ownCopyright,
    subdomains: '1234',
    mapID: 'newest',
    app_id: 'pfAhw6lDnb0sMr5AEBnP',
    app_code: 'o5uOOynx35QJsYG0k-7CWw',
    base: 'aerial',
    maxZoom: 20
});

// ESRI Satellite
var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'+ ownCopyright
});

// ESRI World Physical
var terrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
	maxZoom: 8
});

// OSM France
var osmfr = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
	maxZoom: 20,
	attribution: '&copy; Openstreetmap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
