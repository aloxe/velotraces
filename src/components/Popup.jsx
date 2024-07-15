import { useState } from 'react';
import { countryCodeToFlag } from '../helpers/countryUtil';
import { formatDate } from '../helpers/timeUtil';
import Elevation from './Elevation';
import './Popup.css';


const Popup = ({geojson, handleClickPopup}) => { 
    const [collapsed, setCollapsed] = useState(false);

    const handleClick = () => {
        handleClickPopup("close")
    }

    if (!geojson.title) return
    return (
    <div className='popup-wraper'>
        <button className="popup-close-button" onClick={handleClick}>×</button>
        <div className='popup-content-wrapper'>
            <div className='popup-content'>
                <div className='popup-title'>🚲 {geojson?.title || ''}</div>
                <div className='popup-date'>{(formatDate(undefined, "ddMMYYYY", geojson?.date) || '') + ' ' + geojson?.countries.map(cc => countryCodeToFlag(cc)).join(' ')}</div>
                <Elevation geojson={geojson} key="elev" />
                <div>{`${geojson?.distance}km`}</div>
                {geojson.features.length > 1 && <>
                    <button className={`collapse-button ${collapsed ? "up" : "right" }`} onClick={() => setCollapsed(!collapsed)}>›</button>
                    <div className={`popup-names ${collapsed ? "show" : "hide" }`}>
                        {geojson.features.map((feature, index) => (
                        <div key={index}>
                            <span style={{color: feature.properties.color ?? "indogo"}}>◉</span> {feature.properties.name}
                        </div>
                        ))}
                    </div>
                </>}
            </div>
        </div>
        <div className='popup-tip-container'>
            <div className='tip'></div>
        </div>
    </div>
    );
}

export default Popup;