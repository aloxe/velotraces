import { gpx } from "togeojson";
import axios from 'axios';

export const getGeoJson = async (url) => {
  try {
    const response = await axios.get('/api/velotraces/allvelotracks/'+url);
    const xmlDom = new DOMParser().parseFromString(response.data, 'application/xml');
    const geojson = gpx(xmlDom)
    
    // removing features with points
    if (geojson.features.filter(feature => feature.geometry.type === "Point").length > 0 ) {
      const featuresFiltered = geojson && geojson.features.filter(feature => feature.geometry.type !== "Point");
      geojson.features = featuresFiltered
    }
    // adding metadata
    geojson.date = getDate(url)
    geojson.title = getTitle(url)
    geojson.countries = getCountries(url)
    geojson.distance = getDistance(geojson)
    return geojson;
  } catch (error) {
    console.error('Error fetching gpx data:', error.message);
    return
  }
}

export function getBoundingBox(data) {
  var bounds = {}, coords, latitude, longitude;
  if (!data) return;

  for (var i = 0; i < data.features.length; i++) {
    coords = data.features[i].geometry.coordinates;
    const type = data.features[i].geometry.type;
    for (var j = 0; j < coords.length; j++) {
      if(type === "MultiLineString") {
        for (var k = 0; k < coords[j].length; k++) {
          longitude = coords[j][k][0];
          latitude = coords[j][k][1];

           bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
           bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
           bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
           bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
        }
      } else { // type === "LineString"
        longitude = coords[j][0];
        latitude = coords[j][1];
        bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
        bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
        bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
        bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
      }
    }
  }
  return bounds;
}

export function getListBoundingBox(data) {
  var bounds = {}, coords, latitude, longitude;

  for (var h = 0; h < data.length; h++) {
    for (var i = 0; i < data[h].features.length; i++) {
      coords = data[h].features[i].geometry.coordinates;
      const type = data[h].features[i].geometry.type;
      for (var j = 0; j < coords.length; j++) {

        if(type === "MultiLineString") {
          for (var k = 0; k < coords[j].length; k++) {
            longitude = coords[j][k][0];
            latitude = coords[j][k][1];

             bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
             bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
             bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
             bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
          }
        } else { // type === "LineString"
          longitude = coords[j][0];
          latitude = coords[j][1];

          bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
          bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
          bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
          bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
        }
      }
    }
  }
  return bounds;
}

export const getZoom = bbox => {
  if (!bbox) return;
  let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

  const resolutionHorizontal = (bbox.xMax - bbox.xMin) / vw;
  const resolutionVertical = (360 * 40.7436654315252 * (bbox.xMax - bbox.xMin) * 2) / (vh * 256);
  const  resolution = Math.max(resolutionHorizontal, resolutionVertical)

  const zoom = Math.log(360 / (resolution))+.55
  return Math.round(zoom);
}

export const getCenter = bbox => {
  if (!bbox) return;
  return {
    lon: (bbox.xMax + bbox.xMin)/2,
    lat: (bbox.yMax + bbox.yMin)/2
  }
}

export const getDate = (file) => {
  const array = file.split('-');
  array[2] = array[2].substr(0, 2).replace(/\D/g, '');
  const fileDate = (array[2].length === 2 && parseInt(array[2]) <= 31) ? 
    array[0] + "-" + array[1] + "-" + array[2] : 
    array[0] + "-" + array[1]
  return fileDate;
}

export const getTitle = (file) => {
  const date = getDate(file);
  const long = parseInt(file.length) - parseInt(date.length) - 4;
  const name = file.substr(date.length, long);
  const array = name.split('.');
  const title = decodeURI(array[0].replace(/[-_]/g, ' ').replace(/[+&]/g, ' & '));
  return title;
}

export const getCountries = (file) => file.split('.').slice(1, -1)

import lineDistance from "turf-line-distance";

export const getDistance = (geojson) => {
  const distance = lineDistance(geojson, 'kilometers');
  return distance.toFixed(2)
}

export const getDistanceList = (geojsonList) => {
  let distance = 0;
  if (!geojsonList || geojsonList.length < 1) return 0; 
  geojsonList.map((json, i) => { 
      if (json) {
        distance = distance + parseInt(json.distance)
      } else {
        console.error("no json in " + i, geojsonList);
      }})
  return distance
}