import { MouseEventHandler, useState } from 'react';
import { countryCodeToFlag } from '../helpers/countryUtils';

import './SideBar.css';

const text: {[key:number]:string} = {
    1: '↻', //'Loading trace list…',
    2: '↻', // 'Loading…',
    3: '↻', // 'One Done…',
    4: '↻', // loading the rest
    5: 'All downloaded'
  };

//   type Country = 'nl'|'be'|'fr'|'de'|'ch'|'at'|'cz'|'pl'|'sk'|'hu'|'it'|'lu'|'si'|'xx'

const SideBar = ({step, currentYear, currentCountry, handleClick}: {step: number, currentYear: string, currentCountry: string, handleClick: MouseEventHandler}) => { 
    const [width, setWidth] = useState('none');

    const toggleSideBar = () => {
        width === 'none' ? setWidth('open130') : setWidth('none')
    }

    const yearNow = new Date().getFullYear()
    const years = [];
    let startYear = 2010;
    while ( startYear <= yearNow ) {
        years.push(startYear++);
    }   
    const countries = ['nl', 'be', 'fr', 'de', 'ch', 'at', 'cz', 'pl', 'sk', 'hu', 'it', 'lu', 'si', 'xx']

    return (
        <>
        <div className={`bubble ${width}`} onClick={toggleSideBar}>
            {width === 'none' ? '»' : '×'}
        </div>
        <div className={`sidebar ${width}`}>
            <div className={ step < 5 ? 'rotate' : 'status'}>
                {text[step]}
            </div>
            <h3>years</h3>
            <div className='tags'>
                {years.map(year => (<button className={`tag ${currentYear === year.toString() && 'select'}`} onClick={handleClick} key={year}>{year}</button>))}
                <button className={`tag ${currentYear === 'all' && 'select'}`} onClick={handleClick}>all</button>
            </div>
            <h3>countries</h3>
            <div className='tags flags'>
                {countries.map(country => (<button className={`tag ${currentCountry === country && 'select'}`} onClick={handleClick}key={country}>{countryCodeToFlag(country)}</button>))}
            </div>
        </div>
        </>
    );
    }

export default SideBar;