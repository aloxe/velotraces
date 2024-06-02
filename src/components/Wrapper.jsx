import { useEffect, useState } from "react";
import SideBar from "./SideBar";
import { flagToCountryCode } from "../helpers/countryUtil";
import { filterGpxList, getGpxList, getYear, loadGeoJson } from "../helpers/gpxUtil";
import MainMap from "./MainMap";
import { useNavigate, useParams } from "react-router-dom";
import { getCountryInParams, getYearInParams } from "../helpers/routerUtils";

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
            const geojson = allGeojsonList.find(track => track.url === url) || await loadGeoJson(url)
            if (!allGeojsonList.find(track => track.url === url)) {
              geojson["url"] = url;
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
  }, [step, gpxList, allGeojsonList]);

  const handleClickTile = (e) => {
    setCurrentTile(e.target.alt)
  }

  const handleClickSideBar = (e) => {
    // close popup
    const PopupEl = e.target.parentNode.parentNode.nextSibling.children[0].children[1].children[0]
    PopupEl && console.log(PopupEl, PopupEl.className);
    // console.log("do hide");
    // PopupEl.style.display = 'none'
    //avoid hiding tracks
    // if (PopupEl && PopupEl.className === "popup-wraper") {
    //   console.log("should hide");
    //   PopupEl.style.display = 'none'
    // }
    // unset currentFocus: done each time geojsonList changes
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
        <MainMap geojsonList={geojsonList} tileName={currentTile} />
    </div>
  );
}

export default Wrapper;
