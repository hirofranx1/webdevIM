import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react'
import axios from 'axios';
import { UserContext } from "./UserContext";

function Login() {

    const nav = useNavigate();
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [localuser, setLocaluser] = useState(null);
    const {user, setUser} = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    
    const validateEmail = (email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailRegex.test(email);
    };

    async function handleLogin(e) {
        e.preventDefault();
        if(!validateEmail(email)){
          return setError("Invalid Email")
        }
        setLoading(true); // Show loading state
        axios.post("http://localhost:5000/login", {email, password})
        .then((response) => {
          console.log(response.data);
          setLocaluser(response.data.user);
          setUser(response.data.user); // Set user data in UserContext
          localStorage.setItem("user", JSON.stringify(response.data.user));
          nav('/dashboard');
        }).catch((error) => {
          console.log(error);
          if(error.response){
            setError(error.response.data.message);
          } else {
            setError("An error occured while trying to log in");
          }
        }).finally(() => {
          setLoading(false); // Hide loading state
        });
       }

    return (
    <>
        <form onSubmit={(e)=>handleLogin(e)}>
        <div className="container mb-5">
                <h1 className="text-big mb-5 text-center">LOGO <small className="text-body-secondary">here!</small></h1>
                <label className="text-start fw-bold mb-5">Email Address:<br />
                    <input type="email" placeholder='Email' className='form-control form-control-lg mt-2' onChange={(e) => setEmail(e.target.value)}/>
                </label><br />
                <label className='text-start fw-bold'>Password:
                    <input type="password" placeholder='Password' className='form-control form-control-lg mt-2' onChange={(e) => setPassword(e.target.value)}/>
                </label><br />
                <div className="form-check mt-3 ms-2 text-start">
                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                    Keep me signed in
                    </label>
                </div>
                <br />
                <div className="d-grid gap-2">
                    <input type="submit" value="Login" className="btn bg-black text-white"/>
                </div>
                {error && <p style={{color: "red"}}>{error}</p>}
            </div>
            <div>
                <small className="mt-5">Not registered yet? <a href="/register" className="text-black">Sign Up</a></small>
            </div>
            <div className="mt-5">
                <p className="text-success-emphasis fs-4 mt-5">Spend Smarter <br />Save More</p>
            </div>
        </form>
    </>
    )
}

export default Login