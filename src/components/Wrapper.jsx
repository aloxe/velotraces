import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCountryInParams, getYearInParams } from "../helpers/routerUtils";
import { filterGpxList, getGpxList, getYear, loadGeoJsonFromGpx } from "../helpers/gpxUtil";
import { flagToCountryCode } from "../helpers/countryUtil";
import SideBar from "./SideBar";
import MainMap from "./MainMap";
import Popup from "./Popup";

const Wrapper = () => {
  const history = useNavigate();
  const params = useParams();
  const track = params.track;
  const year = track ? getYear(track) : getYearInParams(params)
  const country = getCountryInParams(params) || ''

  const [step, setStep] = useState(0);
  const [allGpxList, setAllGpxList] = useState([]);
  const [gpxList, setGpxList] = useState([]);
  const [geojsonList, setGeojsonList] = useState([]);
  const [allGeojsonList, setAllGeojsonList] = useState([]);
  const [currentYear, setCurrentYear] = useState(year);
  const [currentCountry, setCurrentCountry] = useState(country);
  const [currentTile, setCurrentTile] = useState('CartoDBVoyager');
  const [currentGeoJson, setCurrentGeoJson] = useState(null);

  useEffect(() => {
    // do not load anything on initial render
    if (step===0) {
      setStep(1) // > load gpx list
    }
  }, [step]);

  useEffect(() => {
    if (step===1) {
      // load list of gpx files
      const getGpxListAwaited = async () => {
        const gpxList = await getGpxList()
        gpxList.length && setAllGpxList(gpxList)
        setStep(2) // > filter list
      }
      getGpxListAwaited()
    }
  }, [step]);

  useEffect(() => {
    if (step===2) {
      // filter list of gpx files
      const gpxListFiltered = filterGpxList(currentYear, currentCountry, allGpxList)
      if (gpxListFiltered.length) {
        setStep(3) // > load GeoJsonLists to map
        setGpxList(gpxListFiltered)
      } else {
        setGeojsonList([])
        setStep(4) // done TOD: set message for empty map
      }
    }
  }, [step, currentYear, currentCountry, allGpxList, gpxList, allGeojsonList]);

  useEffect(() => {
    if (step===3) {
      // load geojson from a list of gpx files
      const setGeoJsonListAwaited = async (gpxList) => {
        const geojsonList = []
        const requests = gpxList.map( async (url, i) => {
          if (i < gpxList.length) {
            const geojson = allGeojsonList.find(json => json.url === url) || await loadGeoJsonFromGpx(url)
            if (!allGeojsonList.find(json => json.url === url)) {
              geojson["url"] = url;
              if (url === track) {
                setCurrentGeoJson(geojson)
                handleClickPopup("open", geojson)
              }
              allGeojsonList.push(geojson)
            }
            geojsonList.push(geojson)
          }
        })
        Promise.all(requests).then(() => {
          setAllGeojsonList(allGeojsonList)
          setGeojsonList(geojsonList)
          setStep(4) // done
        })
      }
      setGeoJsonListAwaited(gpxList)
    }
  }, [step, gpxList, allGeojsonList, track]);

  const handleClickTile = (e) => {
    setCurrentTile(e.target.alt)
  }

  const handleClickSideBar = (e) => {
    handleClickPopup("close")
    // get click info
    const contryCode = currentCountry === 'xx' ? '' : currentCountry;
    if (e.target.innerText >= 2010) {
      setCurrentYear(e.target.innerText)
      const url = contryCode ? `${contryCode}/${e.target.innerText}/` : `${e.target.innerText}/`
      history(url)
    } else if (e.target.innerText === 'all') {
      setCurrentYear('')
      history(contryCode)
    } else {
      const cc = flagToCountryCode(e.target.innerText)
      setCurrentCountry(cc)
      if (cc !== 'xx') {
        const url = currentYear ? `${cc}/${currentYear}/` : `${cc}/`
        history(url)
      } else {
        history(currentYear ? `${currentYear}/` : '')
      }
    }
    setStep(2) // > filter list
  }

  const handleClickPopup = (label, geoJsonClick = null) => {
    const focusEl = document.getElementsByClassName("CURRENT");

    if (label === "close") {
      focusEl?.classList && focusEl.classList.remove("CURRENT")
      setCurrentGeoJson(null)
    } else {
      setCurrentGeoJson(geoJsonClick)
      history(`/t/${geoJsonClick.url}`)
    }
  }

  return (
    <div className='wrapper'>
        <SideBar
            step={step}
            currentYear={currentYear}
            currentCountry={currentCountry}
            currentTile={currentTile}
            geojsonList={geojsonList}
            handleClick={handleClickSideBar}
            handleClickTile={handleClickTile}
        />
        <MainMap 
          geojsonList={geojsonList}
          tileName={currentTile}
          handleClickPopup={handleClickPopup}
          currentGeoJson={currentGeoJson}
        />
        {currentGeoJson && <Popup 
          geojson={currentGeoJson} 
          handleClickPopup={handleClickPopup} 
        />}
    </div>
  );
}

export default Wrapper;
