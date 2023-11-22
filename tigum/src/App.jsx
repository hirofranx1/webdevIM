import React from 'react'
import Login from './login'
import Register from './register'
import Homepage from './Homepage'
import Dashboard from './Dashboard'
import Budget from './Budgets'
import { UserProvider } from './UserContext'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'



function App() {

  return(
    <>
    <UserProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/hompage' element={<Homepage/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/budget' element={<Budget/>}/>
        </Routes>
      </Router>
      </UserProvider>
    </>
  )  
}

export default App
