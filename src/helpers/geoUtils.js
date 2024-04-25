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
  };