import { useState,useEffect } from 'react'
import Navigation from './components/Navigation'

function App() {

  const [loggedin,setLoggedin] = useState(false)

  const handleLogin = () => {
      setLoggedin(!loggedin)
  }

  useEffect(() => {
    if(localStorage.getItem('token')){
      handleLogin()
    }
  },[])

  return (
    <div>
     <Navigation handleLogin={handleLogin} loggedin={loggedin} />
    </div>
  );
}

export default App;
