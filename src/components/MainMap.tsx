import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet'
import { countryCodeToFlag } from '../helpers/countryUtils';
import { formatDate } from '../helpers/timeUtils';

import 'leaflet/dist/leaflet.css';
import './map.css';


/* eslint-disable  @typescript-eslint/no-explicit-any */
const MainMap = ({geojson, geojsonList}: {geojson:any, geojsonList:any}) => {
      const gpxStyle = () => {
        return {
          color: 'red', 
          weight: 2,
          opacity: 0.4
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
            zoomControl={false}
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
        {geojsonList && geojsonList.map((geojson:any, i:number) => <GeoJSON key={i} data={geojson} style={gpxStyle}>
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