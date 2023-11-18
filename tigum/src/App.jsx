import Login from './login'
import Register from './register'
import Homepage from './Homepage'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'



function App() {

  return(
    <>
    <Router>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/hompage' element={<Homepage/>}/>
      
    </Routes>
  </Router>
    </>
  )  
}

export default App
