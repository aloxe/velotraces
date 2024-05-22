import {  useEffect, useState } from "react";
import { Map, GeoJson } from "pigeon-maps"
import { CartoDBVoyager } from "../helpers/tiles";
import { getCenter, getZoom } from "../helpers/gpxUtil";
import Popup from "./Popup";
import './MainMap.css'

const MainMap = ({geojsonList}) => {
  const [center, setCenter] = useState({lon:3, lat:50});
  const [zoom, setZoom] = useState(8);
  const [geojson, setGeojson] = useState(null);
  const [currentFocus, setCurrentFocus] = useState(null);

  useEffect(() => {
    setCurrentFocus(null)
    if (geojsonList.length) {
      setCenter(getCenter(geojsonList))
      setZoom(getZoom(geojsonList))
    }
  }, [geojsonList]);

  const renderGeoJson = (geojson, key) => {
    // 
    if (!geojson)  return null;
    return (
      <GeoJson
        key={key}
        data={geojson}
        styleCallback={(feature) => {
          if (feature?.geometry?.type === "Point") {
            // removing ugly display for points. Points still triggers some bug in zoom and page positionning
            // TODO: track issue
            // use patch-package to update pigeon-maps 
            return { strokeWidth: "0", stroke: "black", r: '0', };
          }
          return {
            strokeWidth: "3",
            stroke: 'red',
            strokeLinejoin: 'round',
            opacity: '0.4',
          };
        }}
        onClick={e => handleClick(e, geojson)} 
      >
      </GeoJson>
    );
  };

  const handleClick = (e,geojson) => {
    if (currentFocus) {
      currentFocus.map(el => {
        el.setAttribute('stroke', 'red');
        el.setAttribute('opacity', '0.4');
      })
    }
    const svgPathArray = [...e.event.target.parentNode.children];
    // update track node
    setCurrentFocus(svgPathArray)
    // update track data
    setGeojson(geojson)
    svgPathArray.map(el => {
      el.setAttribute('stroke', 'blue');
      el.setAttribute('opacity', '1');
    })

    setCenter(getCenter(geojson))
    setZoom(getZoom(geojson))

    const popEl = e.event.target.parentNode.parentNode.parentNode.parentNode.parentNode.children[1].children[0]
    popEl.style.display = 'block';

    // we don't attach the popup to the trace
    // as it would move with the map
    // TODO make it follow the track
    // popEl.style.left = e.event.clientX - 99+'px'
    // popEl.style.top = e.event.clientY - 108+'px'
  }

  return (
    <div className="MapWrapper">
      <Map
        provider={CartoDBVoyager.tiles}
        defaultZoom={8}
        zoomSnap={false}
        attributionPrefix={CartoDBVoyager.attribution}
        center={[center.lat || 44, center.lon || 3]}
        zoom={zoom || 8}
      >
        {currentFocus && <Popup key='popup' currentFocus={currentFocus} geojson={geojson} />}
        { geojsonList && geojsonList.length>=1 && geojsonList.map((json, i) =>  renderGeoJson(json, i)) }        
      </Map>
    </div>
  );
}

export default MainMap;
