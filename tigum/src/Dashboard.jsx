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
    const [progress, setProgress] = useState(0);
    const [expenseForm, setExpenseForm] = useState(false);
    const [expenseName, setExpenseName] = useState("");
    const [expenseAmount, setExpenseAmount] = useState(0);
    const [expenseCategory, setExpenseCategory] = useState("Others");
    const [expenseDate, setExpenseDate] = useState(new Date());
    const [expense, setExpense] = useState([{}]);

    const [error, setError] = useState(""); 



    const id = user.user_id;
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
        function checkUser(){
            const storedUser = localStorage.getItem("user");
            if(storedUser){
                setUser(JSON.parse(storedUser));
                return;
            }
            else{
                history('/');
            }
        }
        checkUser();
    }, [])

    const handleLogout = () => {
        setUser({
            user_id: "",
        });
        localStorage.removeItem("user");
        history('/');
        console.log(user);
    }

    const toggleExpense = () => {  
        setExpenseForm(!expenseForm);
        setError("");
    }

    async function handleExpense(e){
        e.preventDefault();
        if(expenseAmount <= 0){
            return setError("Please input valid amount");
        }
        if(expenseName === ""){
            return setError("Please Input title");
        }
        const bud_id = Number(selectedIndex) + 1;


        axios.post("http://localhost:5000/addexpense", { bud_id, expenseName, expenseAmount, expenseCategory})
        .then((response) => {
            console.log(response.data);
            
            window.location.reload();
        }).catch((error) => {
            console.log(error);
            if(error.response){
                setError(error.response.data.message);
            } else {
                setError("Something went wrong");
            }
        });
    }

    const budId = budgets[selectedIndex] && budgets[selectedIndex].budget_id;
    console.log(budId);
    
    useEffect(() => {
        console.log(budId);
        axios.get(`http://localhost:5000/getexpenses/${budId}`)
        .then((response) => {
            setExpense(response.data.result);
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error.message);
        });
    }, [budId]);

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

            <br/>
            <button className="btn btn-primary" onClick={gotobudget}>Show Budgets</button>
        </div>

        <div>
            <button className="btn btn-primary" onClick={toggleExpense}>Add Expense</button>
            <br/>
            {expenseForm && (
                <form onSubmit={handleExpense}>
                    <input type="text" placeholder="Expense Title" className="form-control form-control-lg mt-2" onChange={(e) => setExpenseName(e.target.value)}/>
                    <br/>

                    <input type="number" placeholder="Expense Amount" className="form-control form-control-lg mt-2" onChange={(e) => setExpenseAmount(e.target.value)}/>
                    <br/>

                    <label htmlFor="Category">Category </label><br/>
                    <select onChange={(e) => setExpenseCategory(e.target.value)}>
                        <option value="Others">Others</option>
                        <option value="Food">Food</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Rent">Rent</option>
                        {/*add category based on chuchu*/};
                    </select>
                    <br/>
                    <input type="submit" value="Add" className="btn bg-black text-white"/>
                    {error && <p>{error}</p>} 
                    <br/>
                    <br/>
                    <button onClick={toggleExpense} className="btn bg-black text-white">Cancel</button>
                     
                    <br/>
                </form>
            )}


            <p> expenses chuchu </p>
            {expense.map((expense, index) => {
                const utcDate = new Date(expense.expense_time);

                const LocalDate = utcDate.toLocaleString();
                return (
                    <div key={index}>
                        <br/>
                        <div className="d-flex flex-row justify-content-between">
                        <h4>{expense.expense_name}</h4>
                        <p>Expense Amount: {expense.expense_amount}</p>
                        </div>
                        <p>Category: {expense.expense_category}</p>
                         <p>Date: {LocalDate}</p>
                         <br/>
                    </div>
                )
            })}






        </div>
        
        <button className="btn btn-primary" onClick={handleLogout}>Logout</button>



        <br/>


        </>
    )
}
export default Dashboard