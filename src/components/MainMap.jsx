import React from 'react';
import { useEffect, useState } from "react";
import { Map, GeoJson } from "pigeon-maps"
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
        const response = await fetch(`https://alix.guillard.fr/velotraces/tracks.php?y=2010&c=`);
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
              r: "20",
            };
          }}
        />
    );
  };

  return (
    <>
      <Map
        provider={osm}
        defaultCenter={[50.879, 4.6997]}
        defaultZoom={8}
        zoomSnap={false}
        attributionPrefix={<>aloxe</>}
      >

        <SideBar 
          step={step}
          currentYear={currentYear}
          currentCountry={currentCountry}
          handleClick={handleClickSideBar}
        />
        { step>=3 && renderGeoJson(geojson, 'prems') }
        { step===4 && geojsonList.length>=1 && geojsonList.map((json, i) => renderGeoJson(json, i)) }
        { step===5 && geojsonList.map((json, i) => renderGeoJson(json, 'comp'+i)) }

      </Map>
    </>
  );
}

export default MainMap;
