import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const nav = useNavigate();
  const [error, setError] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [passError, setPassError] = useState('');

  // Validation functions...

  async function handleSignUp(e) {
    e.preventDefault();
    // Validation logic...

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
        <h1 className="text-big mb-5 text-center">LOGO <small className="text-body-secondary">here!</small></h1>
        <div className="row">
          <div className="col-md-6">
            <label className="text-start fw-bold mb-3">First Name</label>
            <input type="text" placeholder='First Name' className='form-control mb-3' onChange={(e) => setFirstname(e.target.value)} />
            <label className="text-start fw-bold mb-3">Last Name</label>
            <input type="text" placeholder='Last Name' className='form-control mb-3' onChange={(e) => setLastname(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="text-start fw-bold mb-3">Email Address</label>
            <input type="email" placeholder='Email' className='form-control mb-3' onChange={(e) => setEmail(e.target.value)} />
            <label className="text-start fw-bold mb-3">Password</label>
            <input type="password" placeholder='Password' className='form-control mb-3' onChange={(e) => setPassword(e.target.value)} />
            <label className="text-start fw-bold mb-3">Re-type Password</label>
            <input type="password" placeholder='Re-type Password' className='form-control mb-3' onChange={(e) => setRepassword(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="d-grid gap-2">
        <div className="form-check mt-3 text-start">
          <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            <small className="text-secondary text-wrap">Do You Agree with the Terms and Conditions</small>
          </label>
        </div>
        <input type="submit" className="btn bg-black text-white" value="Sign Up" />
        {(passError || error) && <p style={{ color: 'red' }}>{passError || error}</p>}
      </div>

      <div className="mt-5 text-center">
        <small className="mt-5">Already have an account? <a href="/" className="text-black">Login</a></small>
      </div>
    </form>
  );
}

export default Register;
