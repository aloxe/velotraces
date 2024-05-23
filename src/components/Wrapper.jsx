import { useEffect, useState } from "react";
import SideBar from "./SideBar";
import { flagToCountryCode } from "../helpers/countryUtil";
import { filterGpxList, getGpxList, loadGeoJson } from "../helpers/gpxUtil";
import MainMap from "./MainMap";
import { useParams } from "react-router-dom";
import { getCountryInParams, getYearInParams } from "../helpers/routerUtils";

const Wrapper = () => {
  const params = useParams();
  const country = getCountryInParams(params) || ''
  const year = getYearInParams(params) || ''

  const [step, setStep] = useState(0);
  const [allGpxList, setAllGpxList] = useState([]);
  const [gpxList, setGpxList] = useState([]);
  const [geojsonList, setGeojsonList] = useState([]);
  const [allGeojsonList, setAllGeojsonList] = useState([]);
  const [currentYear, setCurrentYear] = useState(year);
  const [currentCountry, setCurrentCountry] = useState(country);

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
        setGpxList(gpxListFiltered)
        setStep(3) // > load GeoJsonLists
      } else {
        setGeojsonList([])
        setStep(4) // done
      }
    }
  }, [step, currentYear, currentCountry, allGpxList]);

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
      setStep(4) // done
      setGeoJsonListAwaited(gpxList)
    }
  }, [step, gpxList, allGeojsonList]);

  const handleClickSideBar = (e) => {
    // close popup
    const PopupEl = e.target.parentNode.parentNode.nextSibling.children[0].children[1].children[0]
    //avoid hiding tracks
    if (PopupEl && PopupEl.className === "popup-wraper") {
      PopupEl.style.display = 'none'
    }
    // unset currentFocus: done each time geojsonList changes
    // get click info
    if (e.target.innerText >= 2010) {
      setCurrentYear(e.target.innerText)
    } else if (e.target.innerText === 'all') {
      setCurrentYear('')
    } else {
      const cc = flagToCountryCode(e.target.innerText)
      setCurrentCountry(cc)
    }
    setStep(2) // > filter list
  }

  return (
    <div className='wrapper'>
        <SideBar
            step={step}
            currentYear={currentYear}
            currentCountry={currentCountry}
            geojsonList={geojsonList}
            handleClick={handleClickSideBar}
        />
        <MainMap geojsonList={geojsonList} />
    </div>
  );
}

export default Wrapper;
