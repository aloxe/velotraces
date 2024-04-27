import { gpx } from "togeojson";
import axios from 'axios';

export const getGeoJson = async (url) => {
  try {
    const response = await axios.get('/api/velotraces/allvelotracks/'+url);
    const xmlDom = new DOMParser().parseFromString(response.data, 'application/xml');
    const geojson = gpx(xmlDom) // maybe use omnivore instead
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

export const getCountries = (file) => {
  const countries = [];
  const array = file.split('.');
  var i = 1;
  while(i < array.length -1 ) {
      array[i]
      countries[i -1] = {
          code: array[i],
          name: getCountryName(array[i].toUpperCase())
      }
      countries[i -1].link = '<a href="#?c=' + countries[i -1].code + '">' + countries[i -1].name + "</a>";
      countries[i -1].url = '#?c=' + countries[i -1].code;
      i++;
  }
      countries[0].chain = ``;
  for (var i = 0; i < countries.length; i++) {
      if (countries[i] !== countries[0]) {
          countries[0].chain += `, `;
      }
      if (countries[i]) {
          countries[0].chain += `<a href="` + countries[i].url + `"   onClick="jumpTo('` + countries[i].url + `');">` + countries[i].name + `</a>`;
      }
  }
  if (countries.length >= 1) {
      return countries;
  } else {
      return false;
  }
}