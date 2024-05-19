import { countryCodeToFlag } from '../helpers/countryUtil';
import { formatDate } from '../helpers/timeUtil';
import './Popup.css';


const Popup = ({currentFocus, geojson}) => { 

    const handleClick = (e) => {
        if (currentFocus) {
            currentFocus.map(el => {
              el.setAttribute('stroke', 'red');
              el.setAttribute('opacity', '0.5');
            })
          }
        e.target.parentNode.style.display = 'none'
    }

    return (
        <>
        <div className='popup-wraper'>
        <button className="popup-close-button" onClick={handleClick}>×</button>
            <div className='popup-content-wrapper'>
                <div className='popup-content'>
                    <div className='popup-title'>🚲 {geojson?.title || ''}</div>
                    <div className='popup-date'>{(formatDate(undefined, "ddMMYYYY", geojson?.date) || '') + ' ' + geojson?.countries.map(cc => countryCodeToFlag(cc)).join(' ')}</div>
                    <div>{`${geojson?.distance}km`}</div>
                </div>
            </div>
            <div className='popup-tip-container'>
                <div className='tip'></div>
            </div>
        </div>
        </>
    );
    }

export default Popup;