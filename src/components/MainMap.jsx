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
      className={geojson.url === currentGeoJson?.url && "CURRENT"}
        key={key}
        data={geojson}
        styleCallback={(feature) => {
          if (feature?.geometry?.type === "Point") {
            // removing ugly display for points. Points still triggers some bug in zoom and page positionning
            // TODO: track issue
            // use patch-package to update pigeon-maps 
            return { strokeWidth: "0", stroke: "black", r: '0', };
          }
        if (geojson.color === "rainbow") {
          return {
            strokeWidth: "2",
            stroke: feature.properties.color,
            strokeLinejoin: 'round',
            opacity: '0.8',
          };
        }
        if (geojson.url === currentGeoJson?.url) {
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
