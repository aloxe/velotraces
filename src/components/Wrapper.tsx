import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { getGeoJson } from '../helpers/gpxUtils';
import { flagToCountryCode } from '../helpers/countryUtils';
import SideBar from './SideBar';
import MainMap from './MainMap';

import 'leaflet/dist/leaflet.css';
import './map.css';

/* eslint-disable  @typescript-eslint/no-explicit-any */
const Wrapper = () => {
    const [step, setStep] = useState(0);
    const [gpxList, setGpxList] = useState([]);
    const [geojson, setGeojson] = useState<any>(null);
    // const [center, setCenter] = useState({lon:3, lat:50});
    const [geojsonList, setGeojsonList] = useState<any[] | []>([]);
    const [currentYear, setCurrentYear] = useState<string>('');
    const [currentCountry, setCurrentCountry] = useState<string>('');

    useEffect(() => {
        // do not load anything do not load on initial render
        if (step===0) {
          setStep(1)
        }
      }, [step]);

      useEffect(() => {
        if (step===1) {
          const getGpxListAwaited = async () => {
            try {
              const response = await axios.get('/api/data/velo/tracks.php?y=2022&c=');
              setGpxList(response.data)
            } catch (error: unknown) {
                if (error instanceof AxiosError || error instanceof Error) {
                    console.error('oups Error fetching data:', error.message);
                }
            }
          }
          getGpxListAwaited()
          setStep(2)
        }
      }, [step]);

      useEffect(() => {
        if (step===2 && gpxList.length > 0) {
          const setGeoJsonAwaited = async (url:string) => {
            const geojson = await getGeoJson(url)
            setGeojson(geojson)
            // const center = getCenter(geojson)
            // setCenter(center)
          }
          setStep(3)
          setGeoJsonAwaited(gpxList[gpxList.length-1])
        }
      }, [step, gpxList, geojson]);


      useEffect(() => {
        if (step===3) {
          const setGeoJsonListAwaited = async (gpxList:string[]) => {
            const geojsonList: any[] = []
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
              // const bbox = getListBoundingBox(geojsonList)
              // const center = getCenter(bbox)
              // setCenter(center)
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
            } catch (error: unknown) {
              if (error instanceof AxiosError || error instanceof Error) {
                console.error('oups Error fetching data:', error.message);
              }
            }
          }
          getGpxListAwaited()
        }
      }, [step, currentYear, currentCountry]);

      const handleClickSideBar = (e:React.MouseEvent<HTMLElement>) => {
        const DomEl = e.target as HTMLElement
        if (parseInt(DomEl.innerText) >= 2010) {
          setCurrentYear(DomEl.innerText)
        } else if (DomEl.innerText === 'all') {
          setCurrentYear(DomEl.innerText)
        } else {
          const cc = flagToCountryCode(DomEl.innerText)
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
                handleClick={handleClickSideBar}
            />
            <MainMap 
                geojson={geojson}
                geojsonList={geojsonList}
            />
        </div>
    )
}

export default Wrapper;