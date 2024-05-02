import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet'
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { getGeoJson } from '../helpers/gpxUtils';

import 'leaflet/dist/leaflet.css';
import './map.css';
import { countryCodeToFlag } from '../helpers/countryUtils';
import { formatDate } from '../helpers/timeUtils';


const MainMap = () => {
    const [step, setStep] = useState(0);
    const [gpxList, setGpxList] = useState([]);
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const [geojson, setGeojson] = useState<any>(null);
    // const [center, setCenter] = useState({lon:3, lat:50});
    const [geojsonList, setGeojsonList] = useState<any[] | []>([]);

    useEffect(() => {
        // do not load anything do not load on initial render
        if (step===0) {
          setStep(1)
        }
      }, [step]);

      useEffect(() => {
        if (step===1) {
          const getGpxListAwaited = async () => {
            try {
              const response = await axios.get('/api/data/velo/tracks.php?y=2010&c=');
              setGpxList(response.data)
            } catch (error: unknown) {
                if (error instanceof AxiosError || error instanceof Error) {
                    console.error('oups Error fetching data:', error.message);
                }
            }
          }
          getGpxListAwaited()
          setStep(2)
        }
      }, [step]);

      useEffect(() => {
        if (step===2 && gpxList.length > 0) {
          const setGeoJsonAwaited = async (url:string) => {
            const geojson = await getGeoJson(url)
            setGeojson(geojson)
            // const bbox = getBoundingBox(geojson)
            // const center = getCenter(bbox)
            // setCenter(center)
          }
          setStep(3)
          setGeoJsonAwaited(gpxList[gpxList.length-1])
        }
      }, [step, gpxList, geojson]);


      useEffect(() => {
        if (step===3) {
          const setGeoJsonListAwaited = async (gpxList:string[]) => {
            const geojsonList: any[] = []
            const requests = gpxList.map( async (url, i) => {
              if (i < gpxList.length - 1) {
                const geojson = await getGeoJson(url)
                geojsonList.push(geojson)
                setGeojsonList(geojsonList) 
                // need to find a way to render on each track
              }
            })
            Promise.all(requests).then(() => {
              setGeojsonList(geojsonList)
              // const bbox = getListBoundingBox(geojsonList)
              // const center = getCenter(bbox)
              // setCenter(center)
              setStep(5) // make sure we are done
            })
          }
    
          setStep(4)
          setGeoJsonListAwaited(gpxList)
        }
      }, [step, gpxList]);


      const gpxStyle = () => {
        return {
          color: 'red', 
          weight: 2,
          opacity: 0.7
        };
      };

    return (
        <MapContainer 
            center={[49.61, 6.1]} 
            zoom={8} 
            zoomSnap={0}
            scrollWheelZoom={true}
            wheelPxPerZoomLevel={25}
            wheelDebounceTime={3}
            >
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geojson && <GeoJSON data={geojson} style={gpxStyle}>
            <Popup>
                <h3>{geojson.title}</h3>
                <p>{formatDate(undefined, "ddMMYYYY", geojson.date)} {geojson.countries.map((cc:string) => countryCodeToFlag(cc)).join(' ')} </p>
            </Popup>
        </GeoJSON>}
        {geojsonList && geojsonList.map((geojson, i) => <GeoJSON key={geojson.date+i} data={geojson} style={gpxStyle}>
            <Popup>
                <h3>{geojson.title}</h3>
                <p>{formatDate(undefined, "ddMMYYYY", geojson.date)} {geojson.countries.map((cc:string) => countryCodeToFlag(cc)).join(' ')} </p>
            </Popup>
        </GeoJSON>)
        }
        </MapContainer>
    )
}

export default MainMap;