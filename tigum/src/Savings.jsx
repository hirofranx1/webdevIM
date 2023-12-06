import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import 'react-calendar/dist/Calendar.css';
import { BsThreeDots } from "react-icons/bs";

function Savings() {

    const { user, setUser } = useContext(UserContext);
    const [savings, setSavings] = useState([{}]);
    const [readSave, setReadSave] = useState({});
    const [showEditForm, setShowEditForm] = useState(false);
    const [savingsAmount, setSavingsAmount] = useState(0);
    const [savingsName, setSavingsName] = useState(""); 
    const [showAddForm, setShowAddForm] = useState(false);

    const id = user.user_id;
    const history = useNavigate();
    const back = () => {
        history("/dashboard");
    };

    useEffect(() => {
        axios.get(`http://localhost:5000/getsavings/${id}`)
        .then((response) => {
            setSavings(response.data.result);
        })
        .catch((err) => {
            console.log(err);
        });
    }, [id]);
    
    async function addSavings(e) {
        e.preventDefault();
        try {
            const savingsData = {
                savings_name: savingsName,
                savings_amount: savingsAmount,
                user_id: id
            }
            await axios.post("http://localhost:5000/addsavings", savingsData);
            setShowAddForm(false);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    console.log(readSave)

  return (
    <>
        <button onClick={back} className="btn btn-primary"> Back </button>
        <button onClick={() => setShowAddForm(true)} className="btn btn-primary"> Add Savings </button>
        <h1>Savings</h1>
        <div className="d-flex justify-content-center">
        {savings.map((val, key) => {
            if(key == 0)
            return (
                <div key = {key}>
                    <div>
                        <h2> {val.savings_name} </h2>
                    </div>
                    <div>
                        <h1> Amount </h1>
                        <h2> {val.savings_amount} </h2>
                    </div>
                    <div>
                        <h1> Started </h1>
                        <h2> {new Date(val.savings_date).toLocaleDateString()} </h2>
                        <button onClick={() => setReadSave(val)}>Button</button>
                    </div>
                </div>
            )
        })}
        </div>

        {savings.map((val, key) => {
            if(key > 0)
            return (
                <div key = {key}>
                    <div>
                         {val.savings_name} 
                    </div>
                    <div>
                         Amount 
                        <h2> {val.savings_amount} </h2>
                    </div>
                    <div>
                         Started 
                        <h2> {new Date(val.savings_date).toLocaleDateString()} </h2>
                    </div>
                </div>
            )
        })}


        {showAddForm && (
            <Modal show={true} backdrop={false}>
                <Modal.Header>Add Savings</Modal.Header>
                <form onSubmit = {addSavings}>
                    <Modal.Body>
                    <label>
                        Savings Name
                    </label>
                    <br/>
                    <input type="text" onChange={(e) => setSavingsName(e.target.value)} className="form-control" placeholder="Savings Name" />
                    <br/>
                    <label>
                        Starting Amount
                    </label>
                    <br/>
                    <input type="number" onChange={(e) => setSavingsAmount(e.target.value)} className="form-control" placeholder="Savings Amount" />
                    
                    </Modal.Body>
                    <Modal.Footer>
                    <input type="submit" className="btn btn-primary" value="Add Savings" />
                        <button onClick={() => setShowAddForm(false)} className="btn btn-primary"> Cancel </button>
                    </Modal.Footer>
                </form>


            </Modal>
        )}
    
    </>
  )
}

export default Savings