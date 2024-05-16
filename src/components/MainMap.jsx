import { useEffect, useState } from "react";
// import axios from 'axios';
import { Map, GeoJson } from "pigeon-maps"
import SideBar from "./SideBar";
import { countryCodeToFlag, flagToCountryCode } from "../helpers/countryUtil";
import { getZoom, getCenter, getListBoundingBox, filterGpxList, getGpxList, loadGeoJson } from "../helpers/gpxUtil";
import Popup from "./Popup";
import { formatDate } from "../helpers/timeUtil";
import { CartoDBVoyager } from "../helpers/tiles";

const MainMap = () => {
  const [step, setStep] = useState(0);
  const [allGpxList, setAllGpxList] = useState([]);
  const [gpxList, setGpxList] = useState([]);
  const [geojson, setGeojson] = useState(null);
  const [center, setCenter] = useState({lon:3, lat:50});
  const [zoom, setZoom] = useState(8);
  const [geojsonList, setGeojsonList] = useState([]);
  const [allGeojsonList, setAllGeojsonList] = useState([]);
  
  const [currentYear, setCurrentYear] = useState('2024');
  const [currentCountry, setCurrentCountry] = useState('xx');
  const [currentFocus, setCurrentFocus] = useState(null);
  // const allGeojsonList = []
// TODO use swr

  useEffect(() => {
    // do not load anything on initial render
    if (step===0) {
      setStep(1)
      const yearNow = new Date().getFullYear()
      setCurrentYear(yearNow);
    }
  }, [step]);

  useEffect(() => {
    if (step===1) {
      const getGpxListAwaited = async () => {
        const gpxList = await getGpxList()
        gpxList.length && setAllGpxList(gpxList)
      }
      getGpxListAwaited()
      setStep(3)
    }
  }, [step]);

  useEffect(() => {
    if (step===3) {
      const setGeoJsonListAwaited = async (gpxList) => {
        const geojsonList = []
        const requests = gpxList.map( async (url, i) => {
          if (i < gpxList.length) {
            const geojson = allGeojsonList.find(track => track.url === url) || await loadGeoJson(url)
            if (!allGeojsonList.find(track => track.url === url)) {
              geojson["url"] = url;
              allGeojsonList.push(geojson)
            }
            geojsonList.push(geojson)
            setGeojsonList(geojsonList)
            // need to find a way to render on each track
          }
        })
        Promise.all(requests).then(() => {
          setGeojsonList(geojsonList)
          if (geojsonList.length) {
            const bbox = getListBoundingBox(geojsonList)
            setCenter(getCenter(bbox))
            setZoom(getZoom(bbox))
          }
          setAllGeojsonList(allGeojsonList)
          setStep(5) // make sure we are done
        })
      }

      setStep(4)
      setGeoJsonListAwaited(gpxList)
    }
  }, [step, gpxList]);

  useEffect(() => {
    if (step===6) {
      const gpsList = filterGpxList(currentYear, currentCountry, allGpxList)
      if (gpsList.length) {
        setGpxList(gpsList)
        setStep(3)
      } else {
        setGeojsonList([])
        setGeojson(null)
        setStep(5)
      }
    }
  }, [step, currentYear, currentCountry, allGpxList]);

  const handleClickSideBar = (e) => {
    // close popup
    console.log(e.target);
    e.target.parentNode.parentNode.nextSibling.style.display = 'none'
    // get click info
    if (e.target.innerText >= 2010) {
      setCurrentYear(e.target.innerText)
    } else if (e.target.innerText === 'all') {
      setCurrentYear('')
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
        onClick={e => handleClick(e, geojson)} 
      >
      </GeoJson>
    );
  };

  const handleClick = (e, geojson) => {
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

    popEl.children[1].children[0].children[0].innerText = "🚲 " + geojson.title
    popEl.children[1].children[0].children[1].innerText = formatDate(undefined, "ddMMYYYY", geojson.date)
    popEl.children[1].children[0].children[2].innerText = geojson.countries.map(cc => countryCodeToFlag(cc)).join(' ')
    popEl.children[1].children[0].children[3].innerText = geojson.distance+'km' || '';
  }

  return (
    <>
      <Map
        provider={CartoDBVoyager.tiles}
        defaultZoom={8}
        zoomSnap={false}
        attributionPrefix={CartoDBVoyager.attribution}
        center={[center.lat || 44, center.lon || 3]}
        zoom={zoom || 8}
      >

        <SideBar 
          step={step}
          currentYear={currentYear}
          currentCountry={currentCountry}
          geojsonList={geojsonList}
          handleClick={handleClickSideBar}
        />
        <Popup key='popup' currentFocus={currentFocus} />
        { step>=3 && geojson && renderGeoJson(geojson, 'prems') }
        { step===4 && geojsonList && geojsonList.length>=1 && geojsonList.map((json, i) => renderGeoJson(json, i)) }
        { step===5 && geojsonList && geojsonList.map((json, i) => renderGeoJson(json, 'comp'+i)) }

      </Map>
    </>
  );
}

export default MainMap;
