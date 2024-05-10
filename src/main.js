import L from "leaflet";
import { CartoDB_Voyager } from "./tiles";
import 'leaflet/dist/leaflet.css';
import './css/style.css'
import { getGpx, getGpxList } from "./helpers/api";
import { gpx } from "@mapbox/leaflet-omnivore";

let map = L.map('app', {
    center: L.latLng(41.387241,2.168963),
    zoom: 15,
    zoomSnap: 0,
    scrollWheelZoom:true,
    wheelPxPerZoomLevel:25,
    wheelDebounceTime:3,
    zoomControl:false,
    layers: [CartoDB_Voyager],
});

const tracks = await getGpxList();

var arrayLayer = gpx(`/api/gpx/${tracks[0].url}`, null)
.on('ready', function() {
  console.log("add track 1", arrayLayer);
  // map.fitBounds(arrayLayer.getBounds())
})
.addTo(map);

var arrayLayer4 = gpx(`/api/gpx/${tracks[4].url}`, null)
.on('ready', function() {
  console.log("add track 4", arrayLayer4);
  // map.fitBounds(arrayLayer4.getBounds())
  var bounds1 = arrayLayer.getBounds();
var bounds2 = arrayLayer4.getBounds();
map.fitBounds(bounds1.extend(bounds2));
})
.addTo(map);

