import { useEffect, useState } from "react";
import axios from 'axios';
import { Map, GeoJson } from "pigeon-maps"
import { osm } from 'pigeon-maps/providers'
import SideBar from "./SideBar";
import { countryCodeToFlag, flagToCountryCode } from "../helpers/countryUtil";
import { getBoundingBox, getCenter, getGeoJson, getListBoundingBox } from "../helpers/gpxUtil";
import Popup from "./Popup";
import { formatDate } from "../helpers/timeUtil";

const MainMap = () => {
  const [step, setStep] = useState(0);
  const [gpxList, setGpxList] = useState([]);
  const [geojson, setGeojson] = useState(null);
  const [center, setCenter] = useState({lon:3, lat:50});
  const [geojsonList, setGeojsonList] = useState([]);

  const [currentYear, setCurrentYear] = useState('2024');
  const [currentCountry, setCurrentCountry] = useState('xx');
  const [currentFocus, setCurrentFocus] = useState(null);

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
        try {
          const response = await axios.get('/api/velotraces/tracks.php?y=2010&c=');
          setGpxList(response.data)
        } catch (error) {
          console.error('oups Error fetching data:', error.message);
        }
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
        const bbox = getBoundingBox(geojson)
        const center = getCenter(bbox)
        setCenter(center)
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
            // need to find a way to render on each track
          }
        })
        Promise.all(requests).then(() => {
          setGeojsonList(geojsonList)
          const bbox = getListBoundingBox(geojsonList)
          const center = getCenter(bbox)
          setCenter(center)
          setStep(5) // make sure we are done
        })
      }

      setStep(4)
      setGeoJsonListAwaited(gpxList)
    }
  }, [step, gpxList]);

  useEffect(() => {
    if (step===6) {
      const getGpxListAwaited = async () => {
        const loadCountry = currentCountry === 'xx' ? '' : currentCountry;
        const loadYear = currentYear === 'all' ? '' : currentYear;
        try {
          const response = await axios.get(`/api/velotraces/tracks.php?y=${loadYear}&c=${loadCountry}`);
          if (response.data.length > 1) {
            setGpxList(response.data)
            setStep(2)
          } else {
            setStep(5)
          }
        } catch (error) {
          console.error('Error fetching gpx list data:', error.message);
        }
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
        onClick={e => handleClick(e, geojson.title, geojson.date, geojson.countries)} 
      >
      </GeoJson>
    );
  };

  const handleClick = (e, title, date, countries) => {
    if (currentFocus) {
      currentFocus.map(el => {
        el.setAttribute('stroke', 'red');
        el.setAttribute('opacity', '0.5');
      })
    }
    const svgPathArray = [...e.event.target.parentNode.children];
    svgPathArray.map(el => {
      el.setAttribute('stroke', 'blue');
      el.setAttribute('opacity', '1');
    })
    setCurrentFocus(svgPathArray)

    const popEl = e.event.target.parentNode.parentNode.parentNode.parentNode.parentNode.children[1].children[2]
    popEl.style.display = 'block';
    // bellow we don't attach the popup to the trace
    // as it would move with the map (FIXME)
    // popEl.style.left = e.event.clientX - 99+'px'
    // popEl.style.top = e.event.clientY - 108+'px'

    popEl.children[1].children[0].children[0].innerText = "🚲 " + title
    popEl.children[1].children[0].children[1].innerText = formatDate(undefined, "ddMMYYYY", date)
    popEl.children[1].children[0].children[2].innerText = countries.map(cc => countryCodeToFlag(cc)).join(' ')
  }

  return (
    <>
      <Map
        provider={osm}
        defaultZoom={8}
        zoomSnap={false}
        attributionPrefix={<>aloxe</>}
        center={[center.lat, center.lon]}
        zoom={8}
      >

        <SideBar 
          step={step}
          currentYear={currentYear}
          currentCountry={currentCountry}
          handleClick={handleClickSideBar}
        />
        <Popup key='popup' currentFocus={currentFocus} />
        { step>=3 && renderGeoJson(geojson, 'prems') }
        { step===4 && geojsonList.length>=1 && geojsonList.map((json, i) => renderGeoJson(json, i)) }
        { step===5 && geojsonList.map((json, i) => renderGeoJson(json, 'comp'+i)) }

      </Map>
    </>
  );
}

export default MainMap;
