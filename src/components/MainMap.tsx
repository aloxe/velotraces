import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import './map.css';

const MainMap = () => {

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
        <Marker position={[49.61, 6.1]}>
            <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
        </Marker>
        </MapContainer>
    )
}

export default MainMap;