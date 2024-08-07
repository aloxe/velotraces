import { useEffect, useState } from "react";
import { Map, GeoJson } from "pigeon-maps"
import * as Tiles from "../helpers/tiles";
import { getCenter, getZoom } from "../helpers/gpxUtil";
import './MainMap.css'

const MainMap = ({geojsonList, tileName, handleClickPopup, currentGeoJson}) => {
  const [center, setCenter] = useState({lon:3, lat:50});
  const [zoom, setZoom] = useState(8);
  const [currentTiles, setCurrentTiles] = useState(Tiles.CartoDBVoyager)

  useEffect(() => {
    if (currentGeoJson) {
      setCenter(getCenter(currentGeoJson))
      setZoom(getZoom(currentGeoJson))
    }
    else if (geojsonList.length) {
      setCenter(getCenter(geojsonList))
      setZoom(getZoom(geojsonList))
    }
  }, [geojsonList, currentGeoJson]);

  useEffect(() => {
    setCurrentTiles(Tiles[tileName])
  }, [tileName]);

  const renderGeoJson = (geojson, key) => {
    // 
    if (!geojson)  return null;
    return (
      <GeoJson
      className={geojson.slug === currentGeoJson?.slug && "CURRENT"}
        key={key}
        data={geojson}
        styleCallback={(feature) => {
          if (feature?.geometry?.type === "Point") {
            // removing display for points.
            return { strokeWidth: "0", stroke: "black", r: '0', };
          }
        if (geojson.gpx || geojson.slug && geojson.slug === currentGeoJson?.slug) { // gpx or sellected path
          if (geojson.features.length > 1) { // rainbow colours for multi paths geojson
            return {
              strokeWidth: "4",
              stroke: feature.properties.color || "Navy",
              strokeLinejoin: 'round',
              opacity: '1',
            };
          }
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
        onClick={() => !geojson.color && handleClick(geojson)} 
      >
      </GeoJson>
    );
  };

  const handleClick = (geojson) => {
    handleClickPopup("open", geojson)
  }

  // const Attribution = dangerouslySetInnerHTML(currentTiles.attribution)

  const attributionPrefix = <><a href="https://pigeon-maps.js.org/" target="_blank" rel="noreferrer noopener">Pigeon-map</a> by <a href="https://alix.guillard.fr/" target="_blank">Alix Guillard</a></>

  return (
    <div className="MapWrapper">
      <Map
        provider={currentTiles.tiles}
        defaultZoom={8}
        zoomSnap={false}
        attribution={<currentTiles.attribution />}
        attributionPrefix={attributionPrefix}
        center={[center.lat, center.lon]}
        zoom={zoom}
      >
        { geojsonList && geojsonList.length>=1 && geojsonList.map((json, i) =>  renderGeoJson(json, i)) }        
      </Map>
    </div>
  );
}

export default MainMap;
