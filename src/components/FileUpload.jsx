import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { loadGeoJson, uploadFile } from "../helpers/gpxUtil";
import './FileUpload.css'
import { toSlug } from "../helpers/strings";

// https://www.bezkoder.com/react-hooks-file-upload/

const FileUpload = () => {
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentGpx, setcurrentGpx] = useState(undefined);
    const [currentName, setcurrentName] = useState(undefined);
    const [currentGeoJson, setCurrentGeoJson] = useState(undefined);
    const [progress, setProgress] = useState(0);

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
      console.log("useEffect", currentGeoJson);
      if (currentGeoJson) {
        setForm({
          date: currentGeoJson.date,
          title: currentGeoJson.title,
          countries: currentGeoJson.countries
        })
      }
    }, [currentGeoJson]);

    const onDrop = (files) => {
        if (files.length > 0) {
            setSelectedFiles(files);
        }
    };

    const uploadgpx = async () => {
        let currentGpx = selectedFiles[0];
    
        setProgress(0);
        setcurrentGpx(currentGpx);

        const fileName = await uploadFile(currentGpx, (event) => {
          setProgress(Math.round((100 * event.loaded) / event.total));
        })
            setcurrentName(fileName)
      };

      const uploadjson = async () => {
        console.log("CLICK!");
        console.log("form", form);
        console.log("geojson", currentGeoJson);
        // geojson.date = getDate(url)
        // geojson.title = getTitle(url)
        // geojson.countries = getCountries(url)
        // geojson.distance = getDistance(geojson)
        // geojson.slug = geojson.date + toSlug(geojson.title)
      };

      // const mystyle(progress) = {
      //   width: {progress}+'%',
      //   background: "red",
      // };

  return (
  <div>
      {currentGpx && (<div className="progress">
        <div className="progress-value" style={{width: `${progress}%`}} >{progress}%</div>
      </div>)}


    <Dropzone onDrop={onDrop} multiple={false}>
      {({ getRootProps, getInputProps }) => (
        <section>
          <div {...getRootProps({ className: "dropzone" })}>
          {/* <form id="uploadForm" > */}
            <input {...getInputProps()} />
          {/* </form> */}
            {selectedFiles && selectedFiles[0].name ? (
              <div className="selected-file">
                {selectedFiles && selectedFiles[0].name}
              </div>
            ) : (
              "Drag and drop file here, or click to select file"
            )}
          </div>
          <aside className="selected-file-wrapper">
            <button
              className="btn btn-success"
              disabled={!selectedFiles}
              onClick={uploadgpx}
            >
              Upload GPX
            </button>
          </aside>
        </section>
      )}
    </Dropzone>

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
       <aside className="selected-file-wrapper">
            <button
              className="btn btn-success"
              disabled={!selectedFiles}
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
