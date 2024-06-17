import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './Login.css';


const Login = ({ isLogged, setIsLogged }) => { 
    const history = useNavigate();
    const params = useParams();
    const setting = params.setting;
    const [login, setLogin] = useState('Login');

    const onLogin = async (e) => {
        e.preventDefault()
        // reset login style
        e.target.lastChild.style.width = "0.7em"
        e.target.childNodes[0].childNodes[1].style.display = "none"
        setLogin("login")
        let formData = new FormData();
        formData.append("login", login);
        const response = await axios.post('https://alix.guillard.fr/data/velo/api/login.php', formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.status === 201) {
            setIsLogged(true)
        } else {
            console.error(response.data.message);
        }
    }

    const logOff = (e) => {
        e.target.parentNode.style.width = "0.7em"
        setIsLogged(false)
    }

    const loginExpand = (e) => {
        if (e.target.nextSibling?.name === "login") {
            if (e.target.nextSibling.style.display === 'none') {
                e.target.parentNode.style.width = "100%"
                e.target.nextSibling.style.display = "inline-block"
            } else {
                e.target.parentNode.style.width = "0.7em"
                e.target.nextSibling.style.display = "none"
            }
        }
    }

    return (
        <form onSubmit={onLogin} className='login'>
        {!isLogged && 
            <>
                <label name="profile" onClick={loginExpand} style={{width: "0.7em"}}>
                    <span>♙</span>
                    <input type="text" className="login" name="login" 
                    value={login}
                    style={{display: "none"}}
                    onChange={e => {setLogin(e.target.value);}} />
                </label>
            </>
        }
        {isLogged && <>
            <div className="inline">
            <label onClick={logOff} className="king" ><span>♔</span></label>
            {!setting && <label onClick={() => history("/u/gpx")} className="write" ><span>✍</span></label>}
            {setting && <label onClick={() => history("/")} className="velo" ><span>🚲</span></label>}
            </div>
        </>}
        </form>
    );
    }

export default Login;