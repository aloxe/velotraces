// import { useParams } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Wrapper from '../components/Wrapper'
import './App.css'
import FileUpload from '../components/FileUpload';



function App() {
  const params = useParams();
  const setting = params.setting;
    return (
    <div className='App'>
      {setting && <FileUpload />}
      {!setting && <Wrapper />}
    </div>
  )
}

export default App
