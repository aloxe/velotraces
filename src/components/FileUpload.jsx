import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import {getDistance, loadGeoJsonFromGpx, renameGpx, uploadFile, uploadJson } from "../helpers/gpxUtil";
import { toSlug } from "../helpers/strings";
import Login from "./Login";
import './FileUpload.css'

const FileUpload = ({ isLogged, setIsLogged, setGeojsonList }) => {
    const [currentGpx, setCurrentGpx] = useState(undefined);
    const [currentName, setCurrentName] = useState(undefined);
    const [currentGeoJson, setCurrentGeoJson] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("")

    const calcColor = (length, val) => {
      var minHue=320, maxHue=0;
      var curPercent = (val-1)/(length-1);
      return `hsl(${Math.round((curPercent*(maxHue-minHue))+minHue)},100%,50%)`;
  }

    useEffect(() => {
      const getGeoJsonAwaited = async (name) => {
        const geojson = await loadGeoJsonFromGpx(name);
        const l = geojson.features.length;
        geojson.features.map((feature, i) => feature.properties.color = calcColor(l,i));
        geojson.gpx = true;
        setCurrentGeoJson(geojson);
        setGeojsonList([geojson]);
      }
      if (currentName) {
        getGeoJsonAwaited(currentName);
      }
    }, [currentName, setGeojsonList]);

    useEffect(() => {
      const uploadgpx = async () => {
        setProgress(0);
        const fileName = await uploadFile(currentGpx, (event) => {
          setProgress(Math.round((100 * event.loaded) / event.total));
        })
        if (fileName) {
          setCurrentName(fileName)
          setMessage(`💾 ${fileName} téléversé`)
        } else {
          setMessage('💢💢💢 PAS SAUVÉ')
        } 
      };

      if (currentGpx) {
        uploadgpx();
      }
    }, [currentGpx]);

    const onDrop = (files) => {
        if (files.length > 0) {
          setCurrentGpx(files[0]);
        }
    };

      const uploadjson = async () => {
        delete currentGeoJson.gpx;
        currentGeoJson.distance = getDistance(currentGeoJson)
        currentGeoJson.slug = `${currentGeoJson.date}-${toSlug(currentGeoJson.title)}`
        const geoslug = `${currentGeoJson.slug}.${currentGeoJson.countries.toString().replace(',','.')}`
        await renameGpx(currentName, geoslug)
        const saved = await uploadJson(currentGeoJson)
        if (saved.status === 201) {
          setMessage(`💾 ${saved.filename}`)
        } else {
          setMessage(`💢💢💢 ${saved.filename} PAS SAUVÉ`)
        }
        setCurrentGpx(null)
        setCurrentName("")
        setCurrentGeoJson(null)
      };

      const updateFeatureName = async (e) => {
        const i = e.target.name;
        let newFeatures = currentGeoJson.features
        newFeatures[i].properties.name = e.target.value;
        setCurrentGeoJson({...currentGeoJson, features: newFeatures})
      }

      return (
  <div className="upload">

    {isLogged && <Dropzone onDrop={onDrop} multiple={false}>
      {({ getRootProps, getInputProps }) => (
        <section>
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            {currentGpx && currentGpx.name ? (
              <div className="selected-file">
                {currentGpx.name}
              </div>
            ) : (
              <div className="selected-file">
               Upload GPX
            </div>
            )}
            {message && (
              <div className="message">
                {message}
              </div>)}
          </div>
        </section>
      )}
    </Dropzone>}

    {currentGpx && (<div className="progress centered">
      <div className="progress-value " style={{width: `${progress}%`}} >{progress}%</div>
    </div>)}

    {currentGeoJson && <div className="card">
        <form>
          <label>Date: 
            <input type="text" className="date" name="date"
              value={currentGeoJson.date} 
              onChange={e => { setCurrentGeoJson({...currentGeoJson, date: e.target.value}) }}
            />
          </label>
          <label>Title:
            <input type="text" className="title" name="title" 
              value={currentGeoJson.title} 
              onChange={e => { setCurrentGeoJson({...currentGeoJson, title: e.target.value}) }}
            />
          </label>
          <label>
            Countries: 
            <input type="text" className="countries" name="countries" 
              value={currentGeoJson.countries.toString()} 
              onChange={e => { setCurrentGeoJson({...currentGeoJson, countries: e.target.value.split(',')}) }}
            />
          </label>
          <div></div>
       </form>
       <div><b>Filename:</b> {`${currentGeoJson.date}-${currentGeoJson.title && toSlug(currentGeoJson.title.trim())}${currentGeoJson.countries.map(cc=>`.${cc}`).join('')}.json`}      
       </div>
       {<form>
       {currentGeoJson.features.length > 1 && currentGeoJson.features.map((feat,i) => {
        return (<label key={i}><div><span style={{color: feat.properties.color ?? "indogo"}}>◉</span> {feat.properties.time}:</div>
          <input type="text" name={i} value={feat.properties.name} onChange={updateFeatureName} />
        </label>)
       })}
       </form>}
       <aside className="selected-file-wrapper">
            <button
              className="btn btn-success"
              disabled={!currentGeoJson}
              onClick={uploadjson}
            >
              Upload GeoJson
            </button>
        </aside>   
      </div>}
  <div className='footer'>
      <Login isLogged={isLogged} setIsLogged={setIsLogged} />
  </div>
  </div>

  );
};

export default FileUpload;
