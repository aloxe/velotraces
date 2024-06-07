import React from 'react';
import { useEffect, useState } from "react";
import { Map, GeoJson, Marker } from "pigeon-maps"
import { osm } from 'pigeon-maps/providers'
import { gpx } from "togeojson";
import SideBar from "./SideBar";
import { flagToCountryCode } from "../helpers/countryUtils";

const getGeoJson = async (url) => {
  const response = await fetch('https://alix.guillard.fr/velotraces/allvelotracks/'+url);
  const data = await response.text();
  const xmlDom = new DOMParser().parseFromString(data, 'application/xml');
  const geojson = gpx(xmlDom)
  return geojson;
};

const MainMap = () => {
  const [step, setStep] = useState(0);
  const [gpxList, setGpxList] = useState([]);
  const [geojson, setGeojson] = useState(null);
  const [geojsonList, setGeojsonList] = useState([]);

  const [currentYear, setCurrentYear] = useState('2024');
  const [currentCountry, setCurrentCountry] = useState('xx');

// TODO use swr

  useEffect(() => {
    // do not load anything do not load on initial render
    if (step===0) {
      setStep(1)
      const yearNow = new Date().getFullYear()
      setCurrentYear(yearNow);
    }
  }, [step]);

  useEffect(() => {
    if (step===1) {
      const getGpxListAwaited = async () => {
        const response = await fetch(`https://alix.guillard.fr/velotraces/tracks.php?y=2011&c=`);
        const data = await response.json();
        setGpxList(data)
      }
      getGpxListAwaited()
      setStep(2)
    }
  }, [step]);

  useEffect(() => {
    if (step===2 && gpxList.length > 0) {
      const setGeoJsonAwaited = async (url) => {
        const geojson = await getGeoJson(url)
        setGeojson(geojson)
      }
      setStep(3)
      setGeoJsonAwaited(gpxList[gpxList.length-1])
    }
  }, [step, gpxList, geojson]);

  useEffect(() => {
    if (step===3) {
      const setGeoJsonListAwaited = async (gpxList) => {
        const geojsonList = []
        const requests = gpxList.map( async (url, i) => {
          if (i < gpxList.length - 1) {
            const geojson = await getGeoJson(url)
            geojsonList.push(geojson)
            setGeojsonList(geojsonList) 
            // need to find a way to rerender on each track
          }
        })
        Promise.all(requests).then(() => {
          setGeojsonList(geojsonList)
          setStep(5) // make sure we are done
        })
      }

      setStep(4)
      setGeoJsonListAwaited(gpxList)
    }
  }, [step]);

  useEffect(() => {
    if (step===6) {
      const getGpxListAwaited = async () => {
        const loadCountry = currentCountry === 'xx' ? '' : currentCountry;
        const loadYear = currentYear === 'all' ? '' : currentYear;
        const response = await fetch(`https://alix.guillard.fr/velotraces/tracks.php?y=${loadYear}&c=${loadCountry}`);
        const data = await response.json();
        setGpxList(data)
        setStep(2)
      }
      getGpxListAwaited()
    }
  }, [step, currentYear, currentCountry]);

  const handleClickSideBar = (e) => {
    if (e.target.innerText >= 2010) {
      setCurrentYear(e.target.innerText)
    } else if (e.target.innerText === 'all') {
      setCurrentYear(e.target.innerText)
    } else {
      const cc = flagToCountryCode(e.target.innerText)
      setCurrentCountry(cc)
    }
    setStep(6)
  }

  const renderGeoJson = (geojson, key) => {
    if (!geojson)  return null;
    return (
      <GeoJson
          key={key}
          data={geojson}
          styleCallback={() => {
            return {
              strokeWidth: "2",
              stroke: "red",
              r: "10",
            };
          }}
        />
    );
  };

const geoJsonSample = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [4.5279, 52.278] },
      properties: { prop0: "value0" },
    },
  ],
};

  return (
    <>
      <Map
        provider={osm}
        defaultCenter={[52.284, 4.52]}
        defaultZoom={17}
        zoomSnap={false}
        attributionPrefix={<>aloxe</>}
      >
      <GeoJson
        data={geoJsonSample}
        styleCallback={(feature, hover) => {
          if (feature.geometry.type === "Point") {
            return {
              fill: hover ? "crimson" : "lightcoral",
              stroke: hover ? "black" : "darkred",
              strokeWidth: "2",
              r: "10",
              path: "m 105.18118,144.78341 c 13.88218,-54.900853 47.12626,-20.15307 62.51039,-48.510217 11.48025,-21.161195 -7.88701,-40.52815 -23.30348,-40.545845 -12.98949,-0.01491 -23.75998,5.030014 -31.12524,15.691032 -9.61521,13.917797 -19.289599,24.284596 -8.08167,73.36503 m 32.30707,-76.511091 17.61856,12.899471 -17.30385,13.528373 z"
              // made with the help of https://codepen.io/leaverou/pen/RmwzKv
            };
          }
          return { strokeWidth: "3", stroke: "blue" };
        }}
      />
                    {/* <Marker
        width={80}
        anchor={[52.285, 4.522]} 
        color={"green"} 
                    fill: green,
            strokeWidth: "4",
            stroke: white",
      /> */}
        {/* <SideBar 
          step={step}
          currentYear={currentYear}
          currentCountry={currentCountry}
          handleClick={handleClickSideBar}
        /> */}
        {/* { step>=3 && renderGeoJson(geojson, 'prems') }
        { step===4 && geojsonList.length>=1 && geojsonList.map((json, i) => renderGeoJson(json, i)) }
        { step===5 && geojsonList.map((json, i) => renderGeoJson(json, 'comp'+i)) } */}

      </Map>
    </>
  );
}

export default MainMap;
