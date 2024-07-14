import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCountryInParams, getYearInParams } from "../helpers/routerUtils";
import { filterGeojsonList, getGeoJsonList, getYear, loadFullGeoJsonFromSlug } from "../helpers/gpxUtil";
import { flagToCountryCode } from "../helpers/countryUtil";
import SideBar from "./SideBar";
import MainMap from "./MainMap";
import Popup from "./Popup";
import FileUpload from '../components/FileUpload';

const Wrapper = ({ isLogged, setIsLogged }) => {
  const history = useNavigate();
  const params = useParams();
  const track = params.track;
  const setting = params.setting;
  const year = track ? getYear(track) : getYearInParams(params)
  const country = getCountryInParams(params) || ''

  const [step, setStep] = useState(0);
  const [allTrackList, setAllTrackList] = useState([]);
  const [trackList, setTrackList] = useState([]);
  const [geojsonList, setGeojsonList] = useState([]);
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
      // load list of all geojson files
      const getGeojsonListAwaited = async () => {
        const trackList = await getGeoJsonList()
        trackList.length && setAllTrackList(trackList)
        setStep(2) // > filter list
      }
      getGeojsonListAwaited()
    }
  }, [step]);

  useEffect(() => {
    if (step===2) {
      // filter list of geojson files
      const trackListFiltered = filterGeojsonList(currentYear, currentCountry, allTrackList)
      if (trackListFiltered.length) {
        setStep(3) // > load GeoJsonLists to map
        setTrackList(trackListFiltered)
      } else {
        setTrackList([])
        setStep(4) // done TODO: set message for empty map
      }
    }
  }, [step, currentYear, currentCountry, allTrackList]);

  useEffect(() => {
    if (step===3) {
      // load geojson from a list of gpx files
      const setGeoJsonListAwaited = async (trackList) => {
        const geojsonList = []
        const requests = trackList.map( async (json, i) => {
          if (i < trackList.length) {
            const fullGeojson = await loadFullGeoJsonFromSlug(json.slug)
            if (json.slug === track) {
                setCurrentGeoJson(fullGeojson)
                handleClickPopup("open", fullGeojson)
              }
            geojsonList.push(fullGeojson)
          }
        })
        Promise.all(requests).then(() => {
          setGeojsonList(geojsonList)
          setStep(4) // done
        })
      }
      setGeoJsonListAwaited(trackList)
    }
  }, [step, trackList, track, currentGeoJson]);

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
      history(`/t/${geoJsonClick.slug}`)
    }
  }

  return (
    <div className='wrapper'>
        {!setting && <SideBar
            step={step}
            currentYear={currentYear}
            currentCountry={currentCountry}
            currentTile={currentTile}
            geojsonList={geojsonList}
            handleClick={handleClickSideBar}
            handleClickTile={handleClickTile}
            isLogged={isLogged}
            setIsLogged={setIsLogged} 
        />}
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
        {setting && <FileUpload 
          isLogged={isLogged} 
          setIsLogged={setIsLogged}
          setGeojsonList={setGeojsonList}
        />}
    </div>
  );
}

export default Wrapper;
