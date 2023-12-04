import { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { BsThreeDots } from "react-icons/bs";
import { ModalFooter } from "react-bootstrap";

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
  const [expenses, setExpenses] = useState([{}]);
  const [readObject, setReadObject] = useState({});
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

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
    e.preventDefault();
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
    if (
      new Date().getTime() === new Date(endDate).getTime()
    ) {
      return setError("Please Select valid duration");
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
        setError("");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }

  useEffect(() => {
    const budId = readObject.budget_id;
    if (budId) {
      axios
        .get(`http://localhost:5000/getexpensesinbud/${budId}`)
        .then((response) => {
          console.log(response.data.result);
          setExpenses(response.data.result);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, [readObject.budget_id]);

  const formatNumberToPHP = (number) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(number);
  };

  return (
    <>
      <div className="border border-info rounded-5 p-3 m-3">
        <div className="d-flex justify-content-around">
          <button className="btn btn-primary" onClick={gotodashboard}>Back to dashboard</button>
          <button className="btn btn-primary"onClick={toggleForm}>+ add new budget</button>
        </div>

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
                  <div className="mt-3">
                  <input type="submit" value="Add" className="btn bg-black text-white mx-2"/>
                  <button onClick={toggleForm} className="btn bg-black text-white">Cancel</button>
                  </div>
                  {error && <p>{error}</p>}
                  <br />
                </form>
              </Modal.Body>
            </Modal>
          )}
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Budget Name</th>
                <th>Budget Amount</th>
                <th>Ends In</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget, index) => {
                return (
                  <tr key={index}>
                    <td>{budget.budget_name}</td>
                    <td>{formatNumberToPHP(budget.budget_amount)}</td>
                    <td>{new Date(budget.budget_end_date).toLocaleDateString()}</td>
                    <td>
                      <button className="btn"
                        onClick={() => {
                          setReadObject(budget);
                          setShowDetails(true);
                        }}
                      >
                        <BsThreeDots size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {showDetails && (
          <Modal show={true} backdrop={false} centered>
            <Modal.Header>
              <Modal.Title>Budget Details</Modal.Title>
              <div>
                <p>Amount: {formatNumberToPHP(readObject.budget_amount)}</p>
                <p>Name: {readObject.budget_name}</p>
                <p>Remaining: {formatNumberToPHP(readObject.current_budget)}</p>
              </div>
            </Modal.Header>
            <Modal.Body>
              <div className="scrollspy-example" data-spy="scroll" data-target="#expenseTable" style={{ overflowY: 'scroll', height: '200px' }}>
                <table className="table table-striped" id="expenseTable">
                  <thead>
                    <tr>
                      <th>Expense Name</th>
                      <th>Expense Amount</th>
                      <th>Expense Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense, index) => {
                      const expenseId = `expense-${index}`; // Unique ID for each expense item
                      return (
                        <tr key={index} id={expenseId}>
                          <td>{expense.expense_name}</td>
                          <td>{formatNumberToPHP(expense.expense_amount)}</td>
                          <td>{new Date(expense.expense_time).toLocaleDateString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Modal.Body>
            <ModalFooter className="d-flex justify-content-around">
              <button className="btn btn-primary" onClick={() => { setShowUpdateForm(true); setAmount(readObject.budget_amount); setEndDate(readObject.budget_end_date); setTitle(readObject.budget_name); }}>Update Budget</button>
              <button className="btn btn-primary" onClick={() => setShowDeleteForm(true)}>Delete Budget</button>
              <button className="btn btn-primary" onClick={() => setShowDetails(false)}>Cancel</button>
            </ModalFooter>
          </Modal>


        )}

        {showUpdateForm && (
          <Modal show={true} backdrop={false} centered>
            <Modal.Header>
              <Modal.Title>Update Budget</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={updateBudget}>
                <label>Name:</label>
                <br />
                <input
                  type="text"
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={readObject.budget_name}
                  className="form-control form-control-lg mt-2"
                />
                <br />
                <label>Amount:</label>
                <br />
                <input
                  type="number"
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={readObject.budget_amount}
                  className="form-control form-control-lg mt-2"
                />
                <br />

                <label>End Date: (Current) {new Date(
                  readObject.budget_end_date
                ).toLocaleDateString()} </label>
                <br />
                <input
                  type="date"
                  className="form-control form-control-lg mt-2"
                  placeholder={readObject.budget_end_date}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                  }}
                />
                <div className="mt-3">
                  <input className="btn btn-primary mx-2" type="submit" />
                  <button className="btn btn-primary" onClick={() => setShowUpdateForm(false)}>Cancel</button>
                </div>
              </form>
              {error && <p>{error}</p>}

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
              <button className="btn btn-primary mx-2" onClick={() => deleteBudget()}>Confirm Delete</button>
              <button className="btn btn-primary" onClick={() => setShowDeleteForm(false)}>Cancel</button>
            </Modal.Body>
          </Modal>
        )}
      </div>
    </>
  );
}

export default Budget;
