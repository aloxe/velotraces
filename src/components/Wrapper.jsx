import { useEffect, useState } from "react";
import SideBar from "./SideBar";
import { flagToCountryCode } from "../helpers/countryUtil";
import { filterGpxList, getGpxList, loadGeoJson } from "../helpers/gpxUtil";
import MainMap from "./MainMap";

const Wrapper = () => {
  const [step, setStep] = useState(0);
  const [allGpxList, setAllGpxList] = useState([]);
  const [gpxList, setGpxList] = useState([]);
  const [geojsonList, setGeojsonList] = useState([]);
  const [allGeojsonList, setAllGeojsonList] = useState([]);
  const [currentYear, setCurrentYear] = useState('2024');
  const [currentCountry, setCurrentCountry] = useState('xx');

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
            // TODO need to find a way to render on each track
          }
        })
        Promise.all(requests).then(() => {
          setGeojsonList(geojsonList)
          setAllGeojsonList(allGeojsonList)
          setStep(5) // make sure we are done
        })
      }

      setStep(4)
      setGeoJsonListAwaited(gpxList)
    }
  }, [step, gpxList, allGeojsonList]);

  useEffect(() => {
    if (step===6) {
      const gpsList = filterGpxList(currentYear, currentCountry, allGpxList)
      if (gpsList.length) {
        setGpxList(gpsList)
        setStep(3)
      } else {
        setGeojsonList([])
        setStep(5)
      }
    }
  }, [step, currentYear, currentCountry, allGpxList]);

  const handleClickSideBar = (e) => {
    // close popup
    e.target.parentNode.parentNode.nextSibling.children[0].children[1].children[0].style.display = 'none'

    // unset pupup
    // setCurrentFocus(null)

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
