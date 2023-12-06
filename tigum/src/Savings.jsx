import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'react-calendar/dist/Calendar.css';
import { BsThreeDots } from "react-icons/bs";

function Savings() {

    const { user, setUser } = useContext(UserContext);
    const [savings, setSavings] = useState([{}]);

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



  return (
    <>
        <button onClick={back} className="btn btn-primary"> Back </button>

        {savings.map((val, key) => {
            return (
                <div key = {key}>
                    <div>
                        <h1> Savings </h1>
                        <h2> {val.savings_name} </h2>
                    </div>
                    <div>
                        <h1> Amount </h1>
                        <h2> {val.savings_amount} </h2>
                    </div>
                    <div>
                        <h1> Started </h1>
                        <h2> {new Date(val.savings_date).toLocaleDateString()} </h2>
                    </div>
                </div>
            )
        })}
    
    </>
  )
}

export default Savings