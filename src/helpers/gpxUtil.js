import { gpx } from "togeojson";
import axios from 'axios';

export const getGeoJson = async (url) => {
  try {
    const response = await axios.get('/api/velotraces/allvelotracks/'+url);
    const xmlDom = new DOMParser().parseFromString(response.data, 'application/xml');
    const geojson = gpx(xmlDom) // maybe use omnivore instead?
    geojson.date = getDate(url)
    geojson.title = getTitle(url)
    geojson.countries = getCountries(url)
    return geojson;
  } catch (error) {
    console.error('Error fetching gpx data:', error.message);
    return
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