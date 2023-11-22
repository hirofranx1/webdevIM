import React, { useContext } from 'react'
import { UserContext } from './UserContext'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { useNavigate } from 'react-router-dom'

const progress = 80;



function Dashboard(){

    const {user, setUser} = useContext(UserContext);
    console.log(user.user.id);
    const history = useNavigate();
    const gotobudget = () => {
        history.push('/budget');
    }

    return(
        <>
        <p>Welcome, {user ? `${user.firstname} ${user.lastname}` : 'Guest' }</p>


        <div className="d-flex flex-column bg-info rounded p-3">
            <div className="d-flex flex-row justify-content-between">
                <p><small>Balance</small></p><p><small>Active Wallet</small></p>
            </div>

            <ProgressBar now={progress} label={`${progress}%`}/>
            <div onClick={gotobudget}> 
                <p>Budget</p>
                <p>Php </p>
                <p>Expense</p>
                <p>Php </p>
            </div>
        </div>

        <div>
            <p> expenses chuchu </p>
            
        </div>
        </>
    )
}
export default Dashboard