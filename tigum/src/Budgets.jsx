import {useState, useContext} from 'react';
import { UserContext  } from "./UserContext";
import axios from 'axios';


function Budget() {

    const{user, setUser} = useContext(UserContext);
    const id = user.id;

    const [showForm, setShowForm] = useState(false);
    const [calender, setCalender] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [amount, setAmount] = useState(0);
    const [category, setCategory] = useState("Select");
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");

    const toggleForm = () => {
        setShowForm(!showForm);
        setErrorCat("");
    }

    
    const openCalendar = () => {
        setCalender(true);
    }

    async function handleBudget(e){
        e.preventDefault();
        if(amount <= 0){
            return setError("Invalid Amount");
        }

        axios.post("http://localhost:5000/addbudget", {id, title, amount, startDate, endDate})
        .then((response) => {
            console.log(response.data);
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
    console.log(category);




    return(
        <>

            <p>BackButton here to dashboard</p>

            <button onClick={toggleForm}>+ add new budget</button>

            {showForm && (
                <form onSubmit={handleBudget}>
                    <input type="text" placeholder="Budget Title" className="form-control form-control-lg mt-2" onChange={(e) => setTitle(e.target.value)}/>
                    <br/>

                    <input type="number" placeholder="Budget Amount" className="form-control form-control-lg mt-2" onChange={(e) => setAmount(e.target.value)}/>
                    <br/>
                    {/* <label htmlFor="category">Category</label>
                    <select onChange={(e) => setCategory(e.target.value)}>
                        <option value = "Select">Select</option>
                        <option value = "Food">Food</option>
                        <option value = "Transportation">Transportation</option>
                        <option value = "Bills">Bills</option>
                        <option value = "Entertainment">Entertainment</option>
                        <option value = "Shopping">Shopping</option>
                        <option value = "Health">Health</option>
                        <option value = "Others">Others</option>
                    </select>
                    {errorCat && <p>{errorCat}</p>}
                    <br/> */}

                    <label htmlFor="frequency">Until: </label><br/>
                    <input type="radio" id="weekly" name="frequency" value="weekly" onClick={()=> {
                        setCalender(false);
                        let end = new Date(startDate);
                        end.setDate(end.getDate() + 7);
                        setEndDate(end);
                    }}/>
                    <label htmlFor="weekly">Weekly</label><br/>
                    <input type="radio" id="monthly" name="frequency" value="monthly" onClick={()=> {
                        setCalender(false);
                        let end = new Date(startDate);
                        end.setDate(end.getDate() + 30);
                        setEndDate(end);
                    }}/>  
                    <label htmlFor="monthly">Monthly</label><br/>
                    <input type="radio" id="Until Date" name="frequency" value="yearly" onClick={openCalendar}/>
                    <label htmlFor="Until Date">Until Date</label><br/>
                    {calender && (
                        <input type="date" className="form-control form-control-lg mt-2" onClick={(e) => {
                            setEndDate(e.target.value);
                        }}/>
                    )}


                    <input type="submit" value="Add" className="btn bg-black text-white"/>
                    <button onClick={toggleForm} className="btn bg-black text-white">Cancel</button>
                </form>     
            )}

            
            <h4>Budget - 232323</h4>
            <p> Remaining </p>
            <p> Until </p>

        </>
    )

}

export default Budget;