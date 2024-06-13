import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import {getDistance, loadGeoJson, uploadFile, uploadJson } from "../helpers/gpxUtil";
import { toSlug } from "../helpers/strings";
import './FileUpload.css'


// https://www.bezkoder.com/react-hooks-file-upload/

const FileUpload = () => {
    const [currentGpx, setcurrentGpx] = useState(undefined);
    const [currentName, setcurrentName] = useState(undefined);
    const [currentGeoJson, setCurrentGeoJson] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("")
    const [form, setForm] = useState({
      date: '',
      title: '',
      countries: [],
    });
    
    useEffect(() => {
      const getGeoJsonAwaited = async (name) => {
        const geojson = await loadGeoJson(name);
        setCurrentGeoJson(geojson);
      }
      if (currentName) {
        getGeoJsonAwaited(currentName)
      }
    }, [currentName]);

    useEffect(() => {
      if (currentGeoJson) {
        setForm({
          date: currentGeoJson.date,
          title: currentGeoJson.title,
          countries: currentGeoJson.countries
        })
      }
    }, [currentGeoJson]);

    useEffect(() => {
      const uploadgpx = async () => {
        setProgress(0);
        const fileName = await uploadFile(currentGpx, (event) => {
          setProgress(Math.round((100 * event.loaded) / event.total));
        })
        if (fileName) {
          setcurrentName(fileName)
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
          setcurrentGpx(files[0]);
        }
    };

      const uploadjson = async () => {
        currentGeoJson.date = form.date;
        currentGeoJson.title = form.title;
        currentGeoJson.countries = form.countries;
        currentGeoJson.distance = getDistance(currentGeoJson)
        currentGeoJson.slug = `${currentGeoJson.date}-${toSlug(currentGeoJson.title)}`
        const saved = await uploadJson(currentGeoJson)
        if (saved.status === 201) {
          setMessage(`💾 ${saved.filename}`)
        } else {
          setMessage(`💢💢💢 ${saved.filename} PAS SAUVÉ`)
        }
        setcurrentGpx(null)
        setcurrentName("")
        setCurrentGeoJson(null)
      };

      const updateName = async (e) => {
        const i = e.target.name;
        let newFeatures = currentGeoJson.features
        newFeatures[i].properties.name = e.target.value;
        setCurrentGeoJson({...currentGeoJson, features: newFeatures})
      }

      return (
  <div>

    <Dropzone onDrop={onDrop} multiple={false}>
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
    </Dropzone>
    {currentGpx && (<div className="progress centered">
      <div className="progress-value " style={{width: `${progress}%`}} >{progress}%</div>
    </div>)}

    {currentGeoJson && <div className="card">
        <form>
          <label>Date: 
            <input type="text" className="date" name="date" value={form.date} onChange={e => {
            setForm({
              ...form,
              date: e.target.value
            });
          }}/>
          </label>
          <label>Title:
            <input type="text" className="title" name="title" value={form.title} onChange={e => {
            setForm({
              ...form,
              title: e.target.value
            });
          }}/>
          </label>
          <label>
            Countries: 
            <input type="text" className="countries" name="countries" value={form.countries.toString()} onChange={e => {
            setForm({
              ...form,
              countries: e.target.value.split(',')
            });
          }}/>
          </label>
          <div></div>
       </form>
       <div><b>Filename:</b> {`${form.date}-${form.title && toSlug(form.title.trim())}${form.countries.map(cc=>`.${cc}`).join('')}.json`}      
       </div>
       {<form>
       {currentGeoJson.features.length > 1 && currentGeoJson.features.map((feat,i) => {
        return (<label key={i}>{feat.properties.time}:
          <input type="text" name={i} value={feat.properties.name} onChange={updateName} />
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
  </div>
  );
};

export default FileUpload;
