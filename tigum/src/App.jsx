import React from 'react'
import Login from './login'
import Register from './register'
import Dashboard from './Dashboard'
import Budget from './Budgets'
import AccountsAndSettings from './AccountsAndSettings'
import Expenses from './Expenses'
import Reminders from "./Reminders"
import Savings from "./Savings"
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
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/budget' element={<Budget/>}/>
          <Route path='/settings' element={<AccountsAndSettings/>}/>
          <Route path='/expenses' element={<Expenses/>}/>
          <Route path='/reminders' element={<Reminders/>}/>
          <Route path='/savings' element={<Savings/>}/>
        </Routes>
      </Router>
    </UserProvider>

    </>
  )  
}

export default App
