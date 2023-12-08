import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react'
import axios from 'axios';
import { UserContext } from "./UserContext";
import logo from './assets/tigum_logos/logopinas.png';

function Login() {

  const nav = useNavigate();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localuser, setLocaluser] = useState(null);
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [navOut, setNavOut] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  async function handleLogin(e) {
    e.preventDefault();
    if (!validateEmail(email)) {
      return setError("Invalid Email")
    }
    setLoading(true);
    axios.post("http://localhost:5000/login", { email, password })
      .then((response) => {
        setLocaluser(response.data.user);
        setUser(response.data.user);
        setNavOut(true);
        localStorage.setItem("showIntro", JSON.stringify(true));
        localStorage.setItem("navOut", JSON.stringify(navOut));
        localStorage.setItem("user", JSON.stringify(response.data.user));
        nav('/dashboard');
      }).catch((error) => {
        console.log(error);
        if (error.response) {
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
      <form onSubmit={(e) => handleLogin(e)} style={{ width: '45%' }} className='p-4 m-3 rounded-2 position-absolute top-50 start-50 translate-middle'>
        <div className="container mb-5 text-start"> {/* Update: Added 'text-center' class */}
          <img src={logo} alt='Logo' style={{ width: '200px', display: 'block', margin: '0 auto' }} className="mx-auto" /> {/* Update: Applied 'mx-auto' class and inline styles */}

          {/* Email Address */}
          <label className="text-start fw-bold mb-3">Email Address:</label>
          <input
            type="email"
            placeholder='Email'
            className='form-control form-control-lg mb-3'
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <label className='text-start fw-bold mb-3'>Password:</label>
          <input
            type="password"
            placeholder='Password'
            className='form-control form-control-lg mb-3'
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Login Button */}
          <div className="d-grid">
            <input type="submit" value="Login" className="btn bg-black text-white mb-3" />
          </div>

          {/* Error message */}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
        <div className='text-center'>
          <small className="mt-5">Not registered yet? <a href="/register" className="text-black">Sign Up</a></small>
        </div>
        <div className="mt-5 text-center">
          <p className="text-success-emphasis fs-4 mt-5">Spend Smarter <br />Save More</p>
        </div>
      </form>

    </>
  )
}

export default Login