import { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

function Budget() {
  const { user, setUser } = useContext(UserContext);
  const id = user.user_id;
  console.log(id, "id");
  const history = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [calender, setCalender] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [amount, setAmount] = useState(0);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [budgets, setBudgets] = useState([{}]);
  const [readObject, setReadObject] = useState({});
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const gotodashboard = () => {
    history("/dashboard");
  };
  const toggleForm = () => {
    setShowForm(!showForm);
    setError("");
  };

  const openCalendar = () => {
    setCalender(true);
  };

  useEffect(() => {
    function checkUser() {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        console.log(user, "in");
        setUser(JSON.parse(storedUser));
        return;
      } else {
        history("/");
      }
    }
    checkUser();
  }, []);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/getbudgets/${id}`)
        .then((response) => {
          console.log(response.data.result);
          setBudgets(response.data.result);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, [id]);

  async function handleBudget(e) {
    e.preventDefault();
    if (amount <= 0) {
      return setError("Please input valid amount");
    }
    if (title === "") {
      return setError("Please Input title");
    }
    if (new Date(endDate).getTime() === new Date(startDate).getTime()) {
      console.log("same");
      return setError("Please Select duration");
    }
    if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      return setError("Please Select valid duration");
    }
    const curamount = amount;
    axios
      .post("http://localhost:5000/addbudget", {
        id,
        title,
        amount,
        curamount,
        startDate,
        endDate,
      })
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError("An error occured while trying to add budget");
        }
      });
    setShowForm(false);
  }

  async function deleteBudget(e) {
    const deleteId = readObject.budget_id;
    axios
      .put(`http://localhost:5000/deletebudget/${deleteId}`)
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }

  async function updateBudget(e) {
    const updateId = readObject.budget_id;
    if (amount <= 0) {
      return setError("Please input valid amount");
    }
    if (title === "") {
      return setError("Please Input title");
    }
    if (
      new Date(endDate).getTime() === new Date(readObject.startDate).getTime()
    ) {
      return setError("Please Select duration");
    }
    if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      return setError("Please Select valid duration");
    }
    axios
      .put(`http://localhost:5000/updatebudget/${updateId}`, {
        title,
        amount,
        endDate,
      })
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }

  console.log(amount);

  return (
    <>
      <button className="btn btn-primary" onClick={gotodashboard}>
        Back to dashboard
      </button>

      {/* <div><button onClick={setShowCurrent(true)}>Current Budget</button></div>
      <div><button onClick={setShowCurrent(false)}>Finished Budget</button></div>  */}

      <br />
      <br />
      <button onClick={toggleForm}>+ add new budget</button>
      <div className="showCurrentBudget">
        {showForm && (
          <Modal show={true} backdrop={false} centered>
            <Modal.Body>
              <form onSubmit={handleBudget}>
                <input
                  type="text"
                  placeholder="Budget Title"
                  className="form-control form-control-lg mt-2"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <br />

                <input
                  type="number"
                  placeholder="Budget Amount"
                  className="form-control form-control-lg mt-2"
                  onChange={(e) => setAmount(e.target.value)}
                />
                <br />

                <label htmlFor="duration">Duration until: </label>
                <br />
                <input
                  type="radio"
                  id="weekly"
                  name="duration"
                  value="weekly"
                  onClick={() => {
                    setCalender(false);
                    let end = new Date(startDate);
                    end.setDate(end.getDate() + 7);
                    setEndDate(end);
                  }}
                />
                <label htmlFor="weekly">Weekly</label>
                <br />
                <input
                  type="radio"
                  id="monthly"
                  name="duration"
                  value="monthly"
                  onClick={() => {
                    setCalender(false);
                    let end = new Date(startDate);
                    end.setDate(end.getDate() + 30);
                    setEndDate(end);
                  }}
                />
                <label htmlFor="monthly">Monthly</label>
                <br />
                <input
                  type="radio"
                  id="Until Date"
                  name="duration"
                  value="yearly"
                  onClick={openCalendar}
                />
                <label htmlFor="Until Date">Until Date</label>
                <br />
                {calender && (
                  <input
                    type="date"
                    className="form-control form-control-lg mt-2"
                    onChange={(e) => {
                      setEndDate(e.target.value);
                    }}
                  />
                )}
                <br />

                <input
                  type="submit"
                  value="Add"
                  className="btn bg-black text-white"
                />
                <br />
                <button
                  onClick={toggleForm}
                  className="btn bg-black text-white"
                >
                  Cancel
                </button>
                {error && <p>{error}</p>}
                <br />
              </form>
            </Modal.Body>
          </Modal>
        )}
        <br />

        {budgets.map((budget, index) => {
          return (
            <div key={index}>
              <div className="d-flex flex-row justify-content-between">
                <h4>{budget.budget_name}</h4>
                <p>Budget Amount: {budget.budget_amount}</p>
                <p>
                  Budget End Date:{" "}
                  {new Date(budget.budget_end_date).toLocaleDateString()}
                </p>

                <button
                  onClick={() => {
                    setReadObject(budget);
                    console.log(readObject);
                    setTitle(readObject.budget_name);
                    setEndDate(readObject.budget_end_date);
                    setAmount(readObject.budget_amount);
                    setShowUpdateForm(true);
                  }}
                >
                  Update
                </button>
                <button onClick={() => {setShowDeleteForm(true)
                setReadObject(budget)
                }}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>

      {showUpdateForm && (
        <Modal show={true} backdrop={false} centered>
          <Modal.Header>
            <Modal.Title>Update Budget</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={updateBudget}>
              <label>Name:</label>
              <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                placeholder={readObject.budget_name}
              />
              <br />
              <label>Amount:</label>
              <input
                type="number"
                onChange={(e) => setAmount(e.target.value)}
                placeholder={readObject.budget_amount}
              />
              <br />

              <label>End Date: (Current)</label>
              <input
                type="text"
                value={new Date(
                  readObject.budget_end_date
                ).toLocaleDateString()}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <input
                type="date"
                className="form-control form-control-lg mt-2"
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
              />
              <input type="submit" />
              <button onClick={() => setShowUpdateForm(false)}>Cancel</button>
            </form>
          </Modal.Body>
        </Modal>
      )}
      {showDeleteForm && (
        <Modal show={true} backdrop={false} centered>
          <Modal.Body>
            <div className="d-flex flex-row justify-content-between">
              <h4>{readObject.budget_name}</h4>
              <p>Budget Amount: {readObject.budget_amount}</p>
              <p>
                Budget End Date:{" "}
                {new Date(readObject.budget_end_date).toLocaleDateString()}
              </p>
            </div>
            <button onClick={() => deleteBudget()}>Confirm Delete</button>
            <button onClick={() => setShowDeleteForm(false)}>Cancel</button>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}

export default Budget;
