import './Popup.css';


const Popup = ({currentFocus}) => { 

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
                    <div className='popup-title'>🚲 title</div>
                    <div className='popup-date'>date</div>
                    <div>pays</div>
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