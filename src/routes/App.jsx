// import { useParams } from 'react-router-dom';
import Wrapper from '../components/Wrapper'
import './App.css'



function App() {
    return (
    <div className='App'>
      <div>{`mode: ${import.meta.env.MODE} image: ${import.meta.env.VITE_BASE_URL}`}</div>
      <Wrapper />
    </div>
  )
}

export default App
