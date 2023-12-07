import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';


function AccountsAndSettings() {

  const { user, setUser } = useContext(UserContext);
  const [userAcc, setUserAcc] = useState({});
  const [show, setShow] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [oldpassword, setOldpassword] = useState('');
  const [newpassword, setNewpassword] = useState('');
  const [retypepassword, setRetypepassword] = useState('');
  const [error, setError] = useState('');
  const [passError, setPassError] = useState('');



  const id = user.user_id;
  const history = useNavigate();
  const goback = () => {
    history('/dashboard');
  }

  useEffect(() => {
    if (id)
      axios.get(`http://localhost:5000/getuser/${id}`)
        .then((response) => {
          setUserAcc(response.data.user)
          console.log(response.data.user)
        }).catch(error => {
          console.log(error)
        })
  }
    , [id])


  async function updateUser(e) {
    if (id)
      axios.put(`http://localhost:5000/updateuser/${id}`, {
        firstname: firstname,
        lastname: lastname
      }).then((response) => {
        window.location.reload();
        console.log(response.data.user)
      }).catch(error => {
        setError(error.response.data.message)
        console.log(error)
      })
  }

  const validatePassword = (newpassword, retypepassword) => {
    if (newpassword !== retypepassword) {
      return setPassError("Passwords Does not Match");
    }
    if (newpassword.length < 8) {
      return setPassError("Passwords must be at least 8 characters longs");
    }
    if (!/[A-Z]/.test(newpassword)) {
      return setPassError("Password must contain at least one uppercase letter");
    }
    if (!/\d/.test(newpassword)) {
      return setPassError("Password must contain at least one number");
    }

    return true;
  }




  async function changePassword(e) {
    e.preventDefault();
    if (id)
      if (!validatePassword(newpassword, retypepassword)) {
        return;
      }

    axios.put(`http://localhost:5000/changepassword/${id}`, {
      oldpassword: oldpassword,
      newpassword: newpassword,
      retypepassword: retypepassword
    }).then((response) => {

      console.log(response.data.result)
      window.location.reload();
    }).catch(error => {
      setError(error.response.data.message)
      console.log(error)
    })
  }

  return (
    <>
      <button onClick={goback} className="btn btn-dark m-4">Go Back</button>


      <div className="container p-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <h1 className="mt-3 mb-4">Settings</h1>
                </div>
              </div>
              <div className="card-body">
                <h5 className="card-title">Account</h5>
                <p className="card-text"><b>Name:</b> {userAcc.firstname} {userAcc.lastname}</p>
                <p className="card-text"><b>Email:</b> {userAcc.email}</p>
                <div className="d-grid gap-2">
                  <button className="btn btn-primary" onClick={() => {
                    setShow(true);
                    setFirstname(userAcc.firstname);
                    setLastname(userAcc.lastname);
                  }}>Update Credentials</button>
                  <button className="btn btn-primary" onClick={() => setShowChangePassword(true)}>Change Password</button>
                  <button className="btn btn-danger">Delete Account</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {show && (
        <Modal show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={updateUser}>
              <div className="form-group">
                <label htmlFor="firstname">First Name</label>
                <input type="text" className="form-control" id="firstname" name="firstname" placeholder="Enter First Name" defaultValue={userAcc.firstname} onChange={(e) => setFirstname(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="lastname">Last Name</label>
                <input type="text" className="form-control" id="lastname" name="lastname" placeholder="Enter Last Name" defaultValue={userAcc.lastname} onChange={(e) => setLastname(e.target.value)} />
              </div>
              <br />
              <button type="submit" className="btn btn-primary">Update</button>
            </form>
            {error && (<p>{error}</p>)}
          </Modal.Body>
        </Modal>
      )}

      {showChangePassword && (
        <Modal show={showChangePassword} onHide={() => setShowChangePassword(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Change Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={changePassword}>
              <div className="form-group">
                <label htmlFor="oldpassword">Old Password</label>
                <input type="password" className="form-control" required id="oldpassword" name="oldpassword" placeholder="Enter Old Password" onChange={(e) => setOldpassword(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="newpassword">New Password</label>
                <input type="password" className="form-control" required id="newpassword" name="newpassword" placeholder="Enter New Password" onChange={(e) => setNewpassword(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="retypepassword">Retype Password</label>
                <input type="password" className="form-control" required id="retypepassword" name="retypepassword" placeholder="Retype Password" onChange={(e) => setRetypepassword(e.target.value)} />
              </div>
              {(passError || error) && <p style={{ color: 'red' }}>{passError || error}</p>}

              <br />
              <button type="submit" className="btn btn-primary">Change Password</button>
            </form>

          </Modal.Body>
        </Modal>
      )}
    </>
  )
}

export default AccountsAndSettings