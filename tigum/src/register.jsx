import { useState } from 'react'
import './App.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function Register() {
    const nav = useNavigate();
    const [error, setError] = useState("");
    const [firstname,setFirstname] = useState("");
    const [lastname,setLastname] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const [passError, setPassError] = useState("");

    const validateEmail = (email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };

    const validatePassword = (password, repassword) => {
        if(password !== repassword){
            return setPassError("Passwords Does not Match");
        }
        if(password.length < 8){
            return setPassError("Passwords must be at least 8 characters longs");
        }
        if(!/[A-Z]/.test(password)){
            return setPassError("Password must contain at least one uppercase letter");  
        }
        if(!/\d/.test(password)){
            return setPassError("Password must contain at least one number");
        }

        return true;
    }

    async function hanldeSignUp(e){
        e.preventDefault();
        if(!validateEmail(email)){
            return setError("Invalid Email")
        }
        if(!validatePassword(password, repassword)){
            return;
        }
        axios.post('http://localhost:5000/register', { firstname, lastname, email, password })
        .then((response) => {
          console.log(response);
          nav('/');
        }).catch((error) => {
          console.log(error);
          setError(error.response.data.message);
        })
    }
  
    return (
      <>
       <form onSubmit={hanldeSignUp}>
            <input type="text" placeholder='firstname' onChange={(e) => setFirstname(e.target.value)}/>
            <input type="text" placeholder='lastname' onChange={(e) => setLastname(e.target.value)}/>
            <input type="email" placeholder='email'onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder='password' onChange={(e) => setPassword(e.target.value)}/>
            <input type="password" placeholder='Retype password' onChange={(e) => setRepassword(e.target.value)}/>
            <input type="submit" value="submit"/>
            {passError && <p>{passError}</p> || error && <p style={{color: "red"}}>{error}</p> }
       </form>
       <a href="/">Let me in</a>
      </>
    )
}

export default Register