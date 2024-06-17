import Wrapper from '../components/Wrapper'
import { useState } from 'react';
import './App.css'



function App() {
  const [isLogged, setIsLogged] = useState(false);
    return (
    <div className='App'>
      <Wrapper isLogged={isLogged} setIsLogged={setIsLogged} />
    </div>
  )
}

export default App
