// import { useParams } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Wrapper from '../components/Wrapper'
import './App.css'
import FileUpload from '../components/FileUpload';
import { useState } from 'react';



function App() {
  const [isLogged, setIsLogged] = useState(false);
  const params = useParams();
  const setting = params.setting;
    return (
    <div className='App'>
      {setting && <FileUpload isLogged={isLogged} setIsLogged={setIsLogged}/>}
      {!setting && <Wrapper isLogged={isLogged} setIsLogged={setIsLogged} />}
    </div>
  )
}

export default App
