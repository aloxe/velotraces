import { useState } from "react";
import Dropzone from "react-dropzone";
import { uploadFile } from "../helpers/gpxUtil";
import './FileUpload.css'

const FileUpload = () => {
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const [fileInfos, setFileInfos] = useState([]);

    const onDrop = (files) => {
        if (files.length > 0) {
            setSelectedFiles(files);
        }
    };

    const upload = () => {
        let currentFile = selectedFiles[0];
    
        setProgress(0);
        setCurrentFile(currentFile);

        uploadFile(currentFile, (event) => {
          setProgress(Math.round((100 * event.loaded) / event.total));
        })
          .then((response) => {
            setMessage(response.data.message);
            // return getFiles();
          })
          .then((files) => {
            setFileInfos(files.data);
          })
          .catch(() => {
            setProgress(0);
            setMessage("Could not upload the file!");
            setCurrentFile(undefined);
          });
    
        setSelectedFiles(undefined);
      };

      const mystyle = {
        width: {progress}+'%'
      };

  return (
  <div>
      <div className="progress">
        <div className="progress-value" style={mystyle} >{progress}%</div>
      </div>



    {currentFile && (
      <div className="progress mb-3">
        <ol style="--length: 5" role="list">
          <li style="--i: 1">{progress}%</li>
        </ol>
      </div>
    )}


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
              onClick={upload}
            >
              Upload
            </button>
          </aside>
        </section>
      )}
    </Dropzone>

    <div className="alert alert-light" role="alert">
      {message}
    </div>

    {fileInfos.length > 0 && (
      <div className="card">
        <div className="card-header">List of Files</div>
        <ul className="list-group list-group-flush">
          {fileInfos.map((file, index) => (
            <li className="list-group-item" key={index}>
              <a href={file.url}>{file.name}</a>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
  );
};

export default FileUpload;
