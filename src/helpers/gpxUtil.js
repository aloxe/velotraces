import { gpx } from "@mapbox/togeojson";
import axios from 'axios';

export const getGpxList = async () => {
  try {
    const response = await axios.get('https://alix.guillard.fr/data/velo/tracks.php');
    return response.data
  } catch (error) {
    console.error('oups Error fetching data:', error.message);
    return([])
  }
}

export const filterGpxList = (currentYear, currentCountry, allGpxList) => {
  const loadCountry = currentCountry === 'xx' ? '' : currentCountry;
  const loadYear = currentYear === 'all' ? '' : currentYear;
  const gpxList = allGpxList.filter(gpx => {
    const year = getYear(gpx)
    const Countries = getCountries(gpx)
    if (!loadCountry) {
      return year === loadYear
    }
    if (!loadYear) {
      return Countries.includes(loadCountry)
    }
    return year === loadYear && Countries.includes(loadCountry)
  })
  return gpxList
}

export const loadGeoJson = async (url) => {
  try {
    const response = await axios.get('https://alix.guillard.fr/data/velo/gpx/'+url);
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

function getBoundingBox(data) {
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

export const getZoom = geojson => {
  const bbox = Array.isArray(geojson) ? getListBoundingBox(geojson) : getBoundingBox(geojson)
  if (!bbox) return;
  let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  const resolutionHorizontal = (bbox.xMax - bbox.xMin) / vw;
  const resolutionVertical = (360 * 40.7436654315252 * (bbox.yMax - bbox.yMin) * 2) / (vh * 256);
  const  resolution = Math.max(resolutionHorizontal, resolutionVertical*.6)
  
  const zoom = Math.log(360 / (resolution))
  return Math.floor(zoom);
}

export const getCenter = geojson => {
  const bbox = Array.isArray(geojson) ? getListBoundingBox(geojson) : getBoundingBox(geojson)
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

export const getYear = (file) => {
  const fileDate = getDate(file)
  return fileDate.substring(0,4)
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

export const getDistElevData = (geojson) => {
  // TDDO total distance / 20 = gap so we get a small object
  if (!geojson) return 0;
  const totalDist = getDistance(geojson);
  const stepSize = Math.round(totalDist/30)
  const coordinateArray = geojson.features[0].geometry.coordinates
  // flaten the coordinates nested in array
  const coordinates = typeof(coordinateArray[0][0]) === "number" ? coordinateArray : coordinateArray.flat(1)
  const data = [];
  let distance = 0;
  let step = 0;

  coordinates.map((coord, i) => {
    if (coordinates[i-1]) {
      const gap = distanceInKmBetweenEarthCoordinates(coordinates[i-1][1], coordinates[i-1][0], coord[1], coord[0])
      distance = distance + gap
      step = step + gap
      if (step >= stepSize ) { // keep data every stepSize km only
        data.push({"dist": distance, "elev": coord[2]})
        step = 0;
      }
    }
  })
  return data

}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return earthRadiusKm * c;
}