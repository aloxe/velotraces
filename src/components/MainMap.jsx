import { useEffect, useState } from "react";
import { Map, GeoJson } from "pigeon-maps"
import { CartoDBVoyager } from "../helpers/tiles";
import { getCenter, getZoom } from "../helpers/gpxUtil";
import Popup from "./Popup";
import './MainMap.css'
import { useNavigate, useParams } from "react-router-dom";

const MainMap = ({geojsonList}) => {
  const history = useNavigate();
  const params = useParams();
  const track = params.track;
  const [center, setCenter] = useState({lon:3, lat:50});
  const [zoom, setZoom] = useState(8);
  const [geojson, setGeojson] = useState(null);
  const [currentFocus, setCurrentFocus] = useState(null);
  const [currentGeoJsonName, setcurrentGeoJsonName] = useState(track);

  useEffect(() => {
    setCurrentFocus(null)
    if (geojsonList.length) {
      setCenter(getCenter(geojsonList))
      setZoom(getZoom(geojsonList))
    }
  }, [geojsonList]);

  useEffect(() => {
    if (geojsonList && currentGeoJsonName) {
      const focusEl = document.getElementsByClassName("CURRENT");
      if (focusEl.length >= 1) {
        // if multi path, focus only on first path
        const focusArrayChildren = [...focusEl[0].children[0].children[0].children]
        setCurrentFocus(focusArrayChildren)
        const currentGeoJson = geojsonList.find(geojson => geojson.url === currentGeoJsonName)
        setGeojson(currentGeoJson)
        if (currentGeoJson) {
          setCenter(getCenter(currentGeoJson))
          setZoom(getZoom(currentGeoJson))
        }
        const popEl = focusEl[0].parentNode.parentNode.children[1].children[0]
        popEl.style.display = 'block';

        // observe popup mutations to unset GeoJsonName when hidding popup
        var observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutationRecord) {
            if (mutationRecord.target.style.display === "none") {
              setcurrentGeoJsonName(null)
            }
          });    
        });
        observer.observe(popEl, { attributes : true, attributeFilter : ['style'] });
      }
    }
  }, [geojsonList, currentGeoJsonName]);

  const renderGeoJson = (geojson, key) => {
    // 
    if (!geojson)  return null;
    return (
      <GeoJson
      className={geojson.url === currentGeoJsonName && "CURRENT"}
        key={key}
        data={geojson}
        styleCallback={(feature) => {
          if (feature?.geometry?.type === "Point") {
            // removing ugly display for points. Points still triggers some bug in zoom and page positionning
            // TODO: track issue
            // use patch-package to update pigeon-maps 
            return { strokeWidth: "0", stroke: "black", r: '0', };
          }
        if (geojson.url === currentGeoJsonName) {
            return {
              strokeWidth: "4",
              stroke: 'MediumBlue',
              strokeLinejoin: 'round',
              opacity: '1',
            };
          }
          return {
            strokeWidth: "3",
            stroke: 'red',
            strokeLinejoin: 'round',
            opacity: '0.4',
          };
        }}
        onClick={() => handleClick(geojson)} 
      >
      </GeoJson>
    );
  };

  const handleClick = (geojson) => {
    setcurrentGeoJsonName(geojson.url)
    history(`/t/${geojson.url}`)
  }

  return (
    <div className="MapWrapper">
      <Map
        provider={CartoDBVoyager.tiles}
        defaultZoom={8}
        zoomSnap={false}
        attributionPrefix={CartoDBVoyager.attribution}
        center={[center.lat, center.lon]}
        zoom={zoom}
      >
        {currentFocus && <Popup key='popup' currentFocus={currentFocus} geojson={geojson} />}
        { geojsonList && geojsonList.length>=1 && geojsonList.map((json, i) =>  renderGeoJson(json, i)) }        
      </Map>
    </div>
  );
}

export default MainMap;
