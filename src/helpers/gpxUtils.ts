import axios, { AxiosError } from 'axios';
// @ts-expect-error no solution for this
import { gpx } from '@mapbox/togeojson';

export const getGeoJson = async (url:string) => {
  try {
    const response = await axios.get('/api/data/velo/gpx/'+url);
    const xmlDom = new DOMParser().parseFromString(response.data, 'application/xml');
    const geojson = gpx(xmlDom) // maybe use omnivore instead?
    geojson.date = getDate(url)
    geojson.title = getTitle(url)
    geojson.countries = getCountries(url)
    return geojson;
  } catch (error) {
    if (error instanceof AxiosError || error instanceof Error) {
        console.error('oups Error fetching data:', error.message);
    }
    return
  }
}

export const getDate = (file:string) => {
    const array = file.split('-');
    array[2] = array[2].substring(0, 2).replace(/\D/g, '');
    const fileDate = (array[2].length === 2 && parseInt(array[2]) <= 31) ? 
      array[0] + "-" + array[1] + "-" + array[2] : 
      array[0] + "-" + array[1]
    return fileDate;
  }
  
  
  export const getTitle = (file:string) => {
    const date = getDate(file);
    const name = file.substring(date.length);
    const array = name.split('.');
    const title = decodeURI(array[0].replace(/[-_]/g, ' ').replace(/[+&]/g, ' & '));
    return title;
  }

  export const getCountries = (file:string) => file.split('.').slice(1, -1)
