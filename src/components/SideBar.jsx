import { useState } from 'react';
import { countryCodeToFlag } from '../helpers/countryUtil';
import { getDistanceList } from '../helpers/gpxUtil';
import { countries, years } from '../helpers/routerUtils';
import { tiles } from '../helpers/tiles';
import Login from './Login';

import './SideBar.css';

const SideBar = ({step, currentYear, currentCountry, currentTile, geojsonList, handleClick, handleClickTile, isLogged, setIsLogged }) => { 
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
            <h3>tiles</h3>
            <div className='tags tiles'>
                {tiles.map(tile => (<img src={`${import.meta.env.VITE_BASE_URL}img/${tile}.png`} key={tile} alt={tile} onClick={handleClickTile} className={`tag ${currentTile === tile && 'select'}`}/>))}
            </div>
            <div className='tags tiles'>
                <Login isLogged={isLogged} setIsLogged={setIsLogged} />
            </div>
        </div>
        </>
    );
    }

export default SideBar;