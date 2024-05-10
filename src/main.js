import L from "leaflet";
import { CartoDB_Voyager } from "./tiles";
import 'leaflet/dist/leaflet.css';
import './css/style.css'

var map = L.map('app', {
    center: L.latLng(41.387241,2.168963),
    zoom: 15,
    zoomSnap: 0,
    scrollWheelZoom:true,
    wheelPxPerZoomLevel:25,
    wheelDebounceTime:3,
    zoomControl:false,
    layers: [CartoDB_Voyager],
  });
