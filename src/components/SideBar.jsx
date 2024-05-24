import { useState } from 'react';
import { countryCodeToFlag } from '../helpers/countryUtil';
import { getDistanceList } from '../helpers/gpxUtil';
// import { countries, years } from '../routes/App.jsx'
import './SideBar.css';
import { countries, years } from '../helpers/routerUtils';

const SideBar = ({step, currentYear, currentCountry, geojsonList, handleClick}) => { 
    const [width, setWidth] = useState('none');

    const toggleSideBar = () => {
        width === 'none' ? setWidth('open130') : setWidth('none')
    }

    return (
        <>
        <div className={`bubble ${width}`} onClick={toggleSideBar}>
            {width === 'none' ? '»' : '×'}
        </div>
        <div className={`sidebar ${width}`}>
            {step < 4 ? <div className='rotate'>↻</div>
            : <div className='status'>{geojsonList.length} tracks<br/>{getDistanceList(geojsonList)}km </div>}
            <h3>years</h3>
            <div className='tags'>
                {years.map(year => (<button className={`tag ${currentYear === year.toString() && 'select'}`} onClick={handleClick} key={year}>{year}</button>))}
                <button className={`tag ${currentYear === '' && 'select'}`} onClick={handleClick} disabled={currentCountry === 'xx'}>all</button>
            </div>
            <h3>countries</h3>
            <div className='tags flags'>
                {countries.map(country => (<button className={`tag ${currentCountry === country && 'select'}`} onClick={handleClick}key={country}>{countryCodeToFlag(country)}</button>))}
                <button className={`tag ${currentCountry === 'xx' && 'select'}`} onClick={handleClick} disabled={currentYear === ''}>🌍</button>
            </div>
        </div>
        </>
    );
    }

export default SideBar;