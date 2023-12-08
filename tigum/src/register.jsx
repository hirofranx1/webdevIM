import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from './assets/tigum_logos/logopinas.png';

function Register() {
  const nav = useNavigate();
  const [error, setError] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [passError, setPassError] = useState('');

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
  

  async function handleSignUp(e) {
    e.preventDefault();
    if(!validateEmail(email)){
        return setError("Invalid Email")
    }
    if(!validatePassword(password, repassword)){
        return;
    }
  
    axios
      .post('http://localhost:5000/register', { firstname, lastname, email, password })
      .then((response) => {
        console.log(response);
        nav('/');
      })
      .catch((error) => {
        console.log(error);
        setError(error.response?.data?.message || 'An error occurred while signing up');
      });
  }

  return (
    <form onSubmit={handleSignUp} className="container">
      <div className="mb-5">
        <img src={logo} alt='Logo' style={{ width: '200px', display: 'block', margin: '0 auto' }} className="mx-auto" />
        <div className="row">
          <div className="col-md-6">
            <label className="text-start fw-bold mb-3">First Name</label>
            <input type="text" placeholder='First Name' className='form-control mb-3' required onChange={(e) => setFirstname(e.target.value)} />
            <label className="text-start fw-bold mb-3">Last Name</label>
            <input type="text" placeholder='Last Name' className='form-control mb-3' required onChange={(e) => setLastname(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="text-start fw-bold mb-3">Email Address</label>
            <input type="email" placeholder='Email' className='form-control mb-3' required onChange={(e) => setEmail(e.target.value)} />
            <label className="text-start fw-bold mb-3">Password</label>
            <input type="password" placeholder='Password' className='form-control mb-3' required onChange={(e) => setPassword(e.target.value)} />
            <label className="text-start fw-bold mb-3">Re-type Password</label>
            <input type="password" placeholder='Re-type Password' className='form-control mb-3' required onChange={(e) => setRepassword(e.target.value)} />
            {(passError || error) && <p style={{ color: 'red' }}>{passError || error}</p>}
          </div>
        </div>
      </div>

      <div className="d-grid gap-2">
        <input type="submit" className="btn bg-black text-white" value="Sign Up" />
        
      </div>

      <div className="mt-5 text-center">
        <small className="mt-5">Already have an account? <a href="/" className="text-black">Login</a></small>
      </div>
    </form>
  );
}

export default Register;
