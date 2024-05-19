import {  useEffect, useState } from "react";
import { Map, GeoJson } from "pigeon-maps"
import Popup from "./Popup";
import { CartoDBVoyager } from "../helpers/tiles";
import { getCenter, getListBoundingBox, getZoom } from "../helpers/gpxUtil";
import './MainMap.css'

const MainMap = ({geojson, geojsonList}) => {
  const [center, setCenter] = useState({lon:3, lat:50});
  const [zoom, setZoom] = useState(8);

  const [currentFocus, setCurrentFocus] = useState(null);

  useEffect(() => {
    console.log("useEffect");
    if (geojsonList.length) {
      console.log("useEffect", geojsonList.length);
      const bbox = getListBoundingBox(geojsonList)
      setCenter(getCenter(bbox))
      setZoom(getZoom(bbox))
      console.log("bbox", bbox);
    }
  }, [geojsonList]);

  const renderGeoJson = (geojson, key) => {
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
            opacity: '0.5',
          };
        }}
        onClick={e => handleClick(e, geojson)} 
      >
      </GeoJson>
    );
  };

  const handleClick = (e) => {
    if (currentFocus) {
      currentFocus.map(el => {
        el.setAttribute('stroke', 'red');
        el.setAttribute('opacity', '0.5');
      })
    }
    const svgPathArray = [...e.event.target.parentNode.children];
    setCurrentFocus(svgPathArray)
    // setGeojson(geojson)
    svgPathArray.map(el => {
      el.setAttribute('stroke', 'blue');
      el.setAttribute('opacity', '1');
    })

    const popEl = e.event.target.parentNode.parentNode.parentNode.parentNode.parentNode.children[1].children[2]
    popEl.style.display = 'block';
    // bellow we don't attach the popup to the trace
    // as it would move with the map (FIXME)
    // popEl.style.left = e.event.clientX - 99+'px'
    // popEl.style.top = e.event.clientY - 108+'px'

    // popEl.children[1].children[0].children[0].innerText = "🚲 " + geojson.title
    // popEl.children[1].children[0].children[1].innerText = formatDate(undefined, "ddMMYYYY", geojson.date)
    // popEl.children[1].children[0].children[2].innerText = geojson.countries.map(cc => countryCodeToFlag(cc)).join(' ')
    // popEl.children[1].children[0].children[3].innerText = geojson.distance+'km' || '';
  }

  console.log("RENDER MAP");
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
        { geojson && renderGeoJson(geojson, 'prems') }
        { geojsonList && geojsonList.length>=1 && geojsonList.map((json, i) => renderGeoJson(json, i)) }
      </Map>
    </div>
  );
}

export default MainMap;
