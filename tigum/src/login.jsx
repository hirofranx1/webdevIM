import { useNavigate } from 'react-router-dom';
import { useState } from 'react'
import axios from 'axios';

function Login() {

    const nav = useNavigate();
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const validateEmail = (email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };

    async function handleLogin(e) {
        e.preventDefault();
        if(!validateEmail(email)){
            return setError("Invalid Email")
        }
        axios.post("http://localhost:5000/login", {email, password})
        .then((response) => {
            console.log(response);
            nav('/hompage');
        }).catch((error) => {
            console.log(error);
            if(error.response){
            setError(error.response.data.message);
            } else {
                setError("An error occured while trying to log in");
            }
        })
    }

    return (
    <>
        <form onSubmit={(e)=>handleLogin(e)}>
            <input type="email" placeholder="email" onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)}/>
            <input type="submit" value="login"/>
            {error && <p style={{color: "red"}}>{error}</p>}
        </form>
        
        <br></br>

        <a href="/register"> Not a member yet? Click Me</a>
    </>
    )
}

export default Login