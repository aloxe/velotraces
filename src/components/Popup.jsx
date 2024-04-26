import './Popup.css';


const Popup = () => { 

    const handleClick = (e) => {
        console.log(e.target.parentNode);
        e.target.parentNode.style.display = 'none'
    }

    return (
        <>
        <div className='popup-wraper'>
        <a className="popup-close-button" href="#close" onClick={handleClick}>×</a>
            <div className='popup-content-wrapper'>
                <div className='popup-content'>
                    <div>🚲 title</div>
                    <div>date</div>
                    <div>pays année</div>
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