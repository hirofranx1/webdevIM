import React, { useContext } from 'react'
import { UserContext } from './UserContext'
import ProgressBar from 'react-bootstrap/ProgressBar'

const progress = 80;


function Dashboard(){

    const user = useContext(UserContext);

    return(
        <>
        <p>Welcome, {user ? `${user.firstname} ${user.lastname}` : 'Guest' }</p>


        <div className="d-flex flex-column bg-info rounded p-3">
            <div className="d-flex flex-row justify-content-between">
                <p><small>Balance</small></p><p><small>Active Wallet</small></p>
            </div>


            <ProgressBar now={progress} label={`${progress}%`}/>
            <p>Budget</p>
            <p>Php </p>
            <p>Expense</p>
            <p>Php </p>

        </div>
        </>
    )
}
export default Dashboard