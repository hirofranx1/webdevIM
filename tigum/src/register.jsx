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
        <div className="mb-5">
                    <h1 className="text-big mb-5 text-center">LOGO <small className="text-body-secondary">here!</small></h1>
                    <label className="text-start fw-bold mb-5">First Name<br />
                        <input type="text" placeholder='First Name' className='form-control form-control-lg mt-2' onChange={(e) => setFirstname(e.target.value)}/>
                    </label><br />
                    <label className="text-start fw-bold mb-5">Last Name<br />
                        <input type="text" placeholder='Last Name' className='form-control form-control-lg mt-2' onChange={(e) => setLastname(e.target.value)}/>
                    </label><br />
                    <label className="text-start fw-bold mb-4">Email Address<br />
                        <input type="email" placeholder='Email' className='form-control form-control-lg mt-2' onChange={(e) => setEmail(e.target.value)}/>
                    </label><br />
                    <label className='text-start fw-bold mb-4'>Password<br />
                    <input type="password" className='form-control form-control-lg mt-2' placeholder='Password' onChange={(e) => setPassword(e.target.value)}/>
                    </label><br />
                    <label className='text-start fw-bold'>Re-type Password<br />
                    <input type="password" className='form-control form-control-lg mt-2' placeholder='Re-type Password' onChange={(e) => setRepassword(e.target.value)}/>
                    </label><br />
                </div>

                <div className="d-grid gap-2">
                    <div className="form-check mt-3 ms-2 text-start">
                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                        <small className="text-secondary text-wrap">Do You Agree with the Terms and Conditions</small> 
                        </label>
                    </div>
                    <input type="submit" className="btn bg-black text-white" value="Sign Up"/>
                    {passError && <p>{passError}</p> || error && <p style={{color: "red"}}>{error}</p> }
                </div>

                <div className='mt-5'>
                    <small className="mt-5">Already have an account? <a href="/" className="text-black">Login</a></small>
                </div>
        </form>
      </>
    )
}

export default Register