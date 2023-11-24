import {useState, useContext, useEffect} from 'react';
import { UserContext  } from "./UserContext";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Budget() {

    const{user, setUser} = useContext(UserContext);
    const id = user.user_id;
    console.log(id, "id");
    const history = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [calender, setCalender] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [amount, setAmount] = useState(0);
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
    const [budgets, setBudgets] = useState([]);

    const gotodashboard = () => {
        history('/dashboard');
    }
    const toggleForm = () => {
        setShowForm(!showForm);
        setError("");
    }

    const openCalendar = () => {
        setCalender(true);
    }

    useEffect(() => {
        function checkUser(){
            const storedUser = localStorage.getItem("user");
            if(storedUser){
                console.log(user, "in");
                setUser(JSON.parse(storedUser));
                return;
            }
            else{
                history('/');
            }
        }
        checkUser();
    }, [])

    useEffect(() => {
        if(id){
        axios.get(`http://localhost:5000/getbudgets/${id}`)
        .then((response) => {
            console.log(response.data.result);
            setBudgets(response.data.result);
        })
        .catch((error) => {
            console.log(error.message);
        });
    }
    }, [id]);



    async function handleBudget(e){
        e.preventDefault();
        if(amount <= 0){
            return setError("Please input valid amount");
        }
        if(title === ""){
            return setError("Please Input title");
        }
        if(new Date(endDate).getTime() === new Date(startDate).getTime()){
            console.log("same");
            return setError("Please Select duration");
        }
        if(new Date(endDate).getTime() < new Date(startDate).getTime()){
            return setError("Please Select valid duration");
        }
        const curamount = amount;
        axios.post("http://localhost:5000/addbudget", {id, title, amount, curamount, startDate, endDate})
        .then((response) => {
            console.log(response.data);
            window.location.reload();
        }).catch((error) => {
            console.log(error);
            if(error.response){
                setError(error.response.data.message);
            } else {
                setError("An error occured while trying to add budget");
            }
        })
        setShowForm(false);
    }




    return(
        <>
            <button className="btn btn-primary" onClick={gotodashboard}>Back to dashboard</button>
            <br/>
            <br/>
            <button onClick={toggleForm}>+ add new budget</button>

            {showForm && (
                <form onSubmit={handleBudget}>
                    <input type="text" placeholder="Budget Title" className="form-control form-control-lg mt-2" onChange={(e) => setTitle(e.target.value)}/>
                    <br/>

                    <input type="number" placeholder="Budget Amount" className="form-control form-control-lg mt-2" onChange={(e) => setAmount(e.target.value)}/>
                    <br/>

                    <label htmlFor="duration">Duration until: </label><br/>
                    <input type="radio" id="weekly" name="duration" value="weekly" onClick={()=> {
                        setCalender(false);
                        let end = new Date(startDate);
                        end.setDate(end.getDate() + 7);
                        setEndDate(end);
                    }}/>
                    <label htmlFor="weekly">Weekly</label><br/>
                    <input type="radio" id="monthly" name="duration" value="monthly" onClick={()=> {
                        setCalender(false);
                        let end = new Date(startDate);
                        end.setDate(end.getDate() + 30);
                        setEndDate(end);
                    }}/>  
                    <label htmlFor="monthly">Monthly</label><br/>
                    <input type="radio" id="Until Date" name="duration" value="yearly" onClick={openCalendar}/>
                    <label htmlFor="Until Date">Until Date</label><br/>
                    {calender && (
                        <input type="date" className="form-control form-control-lg mt-2" onChange={(e) => {
                            setEndDate(e.target.value);
                        }}/>
                    )}
                    <br/>


                    <input type="submit" value="Add" className="btn bg-black text-white"/>
                    <br/>
                    <button onClick={toggleForm} className="btn bg-black text-white">Cancel</button>
                    {error && <p>{error}</p>}
                    <br/>
                </form>     
            )}
            <br/>

            {budgets.map((budget, index) => {
                return (
                <div key={index}>
                    <div className="d-flex flex-row justify-content-between">
                    <h4>{budget.budget_name}</h4>
                    <p>Budget Amount: {budget.budget_amount}</p>
                    <p>Budget End Date: {new Date(budget.budget_end_date).toLocaleDateString()}</p>
                    </div>
                </div>
                );
                })}
        </>
    )

}

export default Budget;