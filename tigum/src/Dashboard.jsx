import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from './UserContext'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'



function Dashboard(){

    const {user, setUser} = useContext(UserContext);
    const [budgets, setBudgets] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [hasData, setHasData] = useState(false);
    const [spent, setSpent ] = useState(600);
    const id = user.user_id;
    const [progress, setProgress] = useState(0);

    const history = useNavigate();
    const gotobudget = () => {
        history('/budget');
    }


    useEffect(() => {
        if(id){
        axios.get(`http://localhost:5000/getbudgets/${id}`)
        .then((response) => {
            setBudgets(response.data.result);
            console.log(response.data.result.length);
            if(response.data.result.length > 0){
                setHasData(true);
            }
        })
        .catch((error) => {
            console.log(error.message);
        });
    }
    }, [id]);

    useEffect(() => {
        if(budgets[selectedIndex]) {
         let progressValue = (spent / budgets[selectedIndex].budget_amount) * 100;
         let roundedProgress = Number(progressValue.toFixed(2));
         setProgress(roundedProgress);
        }
       }, [selectedIndex, budgets]);

    useEffect(() => {
        console.log(user);
    }, [user]);

    const handleLogout = () => {
        setUser({
            user_id: "",
            firstname: "",
            lastname: "",
            email: ""
        });
        localStorage.removeItem("user");
        history('/');
        console.log(user);
    }
    
    return(
        <>
        <p>Welcome, {user ? `${user.firstname} ${user.lastname}` : 'Guest' }</p>


        <div className="d-flex flex-column bg-info rounded p-3">
            <div className="d-flex flex-row justify-content-between">
                <p><small>Balance</small></p><p><small>Active Wallet</small></p>
            </div>

            { (hasData) && <select onChange = {(e) => {
                setSelectedIndex(e.target.value);
                }}>
                {budgets.map((budget, index) => {
                    return (
                        <option key={`${budget.budget_id}-${index}`} value={index}>{budget.budget_name}</option>
                    )
                })}
            </select>}
            <br/>
            <ProgressBar now={progress} label={`${progress}%`}/>
                <h4> {budgets[selectedIndex] && budgets[selectedIndex].budget_name}</h4>
                <p> Total Expenses = {spent} </p>
                <p> Budget = {budgets[selectedIndex] && budgets[selectedIndex].budget_amount} </p>
                <p> Progress = {progress}%</p>
        </div>

        <div>
            <p> expenses chuchu </p>
            
        </div>

        <button className="btn btn-primary" onClick={gotobudget}>Show Budgets</button>
        
        <button className="btn btn-primary" onClick={handleLogout}>Logout</button>



        <br/>


        </>
    )
}
export default Dashboard