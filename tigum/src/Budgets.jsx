import {useState} from 'react';

function Budget() {

    const [showForm, setShowForm] = useState(false);
    const toggleForm = () => {
        setShowForm(!showForm);
    }

    


    return(
        <>
            <button onClick={toggleForm}>+ add new budget</button>

            {showForm && (
                <form>
                    <input type="number" placeholder="Budget Amount" className="form-control form-control-lg mt-2"/>
                    <br/>
                    <input type="radio" id="weekly" name="budget" value="weekly"/>
                    <label htmlFor="weekly">Weekly</label><br/>
                    <input type="radio" id="monthly" name="budget" value="monthly"/>  
                    <label htmlFor="monthly">Monthly</label><br/>
                    <input type="radio" id="Until Date" name="budget" value="yearly"/>
                    <label htmlFor="Until Date">Until Date</label><br/>
                    

                    <input type="submit" value="Add" className="btn bg-black text-white"/>
                    <button onClick={toggleForm} className="btn bg-black text-white">Cancel</button>
                </form>
                    
            )}
        </>
    )
}

export default Budget;