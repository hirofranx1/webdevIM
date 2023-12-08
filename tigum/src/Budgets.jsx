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
  const [remaining, setRemaining] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [addSaving, setAddSaving] = useState(false);
  const [savings, setSavings] = useState([{}]);
  const [hasSavings, setHasSavings] = useState(0);
  const [previousAmount, setPreviousAmount] = useState(0);
  const [hasBudget, setHasBudget] = useState(0);
  const [hasdata, setHasData] = useState(0);
  const [hasBudgets, setHasBudgets] = useState(0);
  const [isDeleted, setIsDeleted] = useState(0);
  const [isNotDeleted, setIsNotDeleted] = useState(0);
  const [getSavingsIndex, setGetSavingsIndex] = useState(0);
  const [showActiveBudgets, setShowActiveBudgets] = useState(true);

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
          setIsDeleted(response.data.result.filter((budget) => budget.is_deleted === 1).length);
          setIsNotDeleted(response.data.result.filter((budget) => budget.is_deleted === 0).length);
          setHasBudget(response.data.result.length);
          setHasData(response.data.result.length);
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
    axios
      .post("http://localhost:5000/addbudget", {
        id,
        title,
        amount,
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

  async function addtoSaving(e) {
    e.preventDefault();
    const savings_id = getSavingsIndex;
    const budget_id = readObject.budget_id;
    console.log(remaining);
    axios
      .put(`http://localhost:5000/addtosavingsdash`, {
        remaining,
        savings_id,
        budget_id
      })
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }


  useEffect(() => {
    const id = user.user_id;
    if (id) {
      axios
        .get(`http://localhost:5000/getsavings/${id}`)
        .then((response) => {
          setSavings(response.data.result);
          setHasSavings(response.data.result.length);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  })


  async function updateBudget(e) {
    e.preventDefault();
    const updateId = readObject.budget_id;
    const previous_amount = previousAmount;
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
        previous_amount
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

  const toggleActiveInactive = () => {
    setShowActiveBudgets(!showActiveBudgets);
  };

  return (
    <>
      <div className="border border-info rounded-5 p-3 m-3">
        <div className="d-flex justify-content-around border-bottom mb-4">
          <button className="btn btn-primary" onClick={gotodashboard}>Back to dashboard</button>
          <button className="btn btn-primary" onClick={toggleForm}>+ add new budget</button>
        </div>

        <div className="showCurrentBudget">
          {showForm && (
            <Modal show={true} backdrop={false} centered>
              <Modal.Header>
                <h5 className="display-6">
                  Add Budget
                </h5>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={handleBudget}>
                  <input
                    type="text"
                    placeholder="Budget Title"
                    className="form-control form-control-lg mt-2 border-dark"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <br />

                  <input
                    type="number"
                    placeholder="Budget Amount"
                    className="form-control form-control-lg mt-2 border-dark"
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
                  {error && <p className="text-danger">{error}</p>}
                    <input type="submit" value="Add" className="btn bg-primary text-white mx-2" />
                    <button onClick={toggleForm} className="btn bg-secondary text-white">Cancel</button>
                  </div>
                  
                  <br />
                </form>
              </Modal.Body>
            </Modal>
          )}



          <div className="container">
            { hasdata > 0 && (
              <>
                <div className="d-flex justify-content-center">
                  <ul className="nav nav-tabs">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${showActiveBudgets ? 'active bg-dark text-white' : 'text-dark'}`}
                        onClick={() => {
                          if (!showActiveBudgets) {
                            toggleActiveInactive();
                          }
                        }}
                      >
                        Active Budgets
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${!showActiveBudgets ? 'active bg-dark text-white' : 'text-dark'}`}
                        onClick={() => {
                          if (showActiveBudgets) {
                            toggleActiveInactive();
                          }
                        }}
                      >
                        Inactive Budgets
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="tab-content">
                  <div className={`tab-pane fade ${showActiveBudgets ? 'show active bg-secondary text-white' : ''}`}>
                    {/* Content for Active Budgets */}
                    {showActiveBudgets && (
                      <div className="Active Budgets">
                        <table className="table table-striped bg-secondary text-white">
                          <thead>
                            {/* Table Header for Active Budgets */}
                            <tr>
                              <th className="bg-dark text-white">Budget Name</th>
                              <th className="bg-dark text-white">Budget Amount</th>
                              <th className="bg-dark text-white">Ends In</th>
                              <th className="bg-dark text-white">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {budgets.map((budget, index) => {
                              if (budget.is_deleted === 0)
                                return (
                                  <tr key={index} className="border-bottom border-dark">
                                    <td>{budget.budget_name}</td>
                                    <td>{formatNumberToPHP(budget.budget_amount)}</td>
                                    <td>{new Date(budget.budget_end_date).toLocaleDateString()}</td>
                                    <td>
                                      <button
                                        className="btn"
                                        onClick={() => {
                                          setReadObject(budget);
                                          setShowDetails(true);
                                          setPreviousAmount(budget.budget_amount);
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
                    )}
                  </div>
                  <div className={`tab-pane fade ${!showActiveBudgets ? 'show active bg-secondary text-white' : ''}`}>
                    {/* Content for Inactive Budgets */}
                    {!showActiveBudgets && (
                      <div className="Inactive Budgets">
                        <table className="table table-striped bg-secondary text-white">
                          <thead>
                            {/* Table Header for Inactive Budgets */}
                            <tr>
                              <th className="bg-dark text-white">Budget Name</th>
                              <th className="bg-dark text-white">Budget Amount</th>
                              <th className="bg-dark text-white">Ends In</th>
                            </tr>
                          </thead>
                          <tbody>
                            {budgets.map((budget, index) => {
                              if (budget.is_deleted === 1)
                                return (
                                  <tr key={index} className="border-bottom border-dark">
                                    <td>{budget.budget_name}</td>
                                    <td>{formatNumberToPHP(budget.budget_amount)}</td>
                                    <td>{new Date(budget.budget_end_date).toLocaleDateString()}</td>
                                  </tr>
                                );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
            </div>
            </>
            )}
          </div>
          

          {hasBudget === 0 && (
            <div className="d-flex justify-content-center">
              <h3>No Budgets</h3>
            </div>
          )
          }
        </div>

        {showDetails && (
          <Modal show={true} backdrop={false} centered>
            <Modal.Header>
              <Modal.Title>Budget Details</Modal.Title>
              <div>
                <p>Amount: {formatNumberToPHP(readObject.budget_amount)}</p>
                <p>Name: {readObject.budget_name}</p>
                <p>Remaining: {formatNumberToPHP(readObject.remaining_budget)}</p>
                <p>End Date: {new Date(readObject.budget_end_date).toLocaleDateString()}</p>
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
              {(hasSavings > 0 && (readObject.remaining_budget > 0)) && <button className="btn btn-success" onClick={() => { setAddSaving(true); setRemaining(readObject.remaining_budget) }}>Add to Savings</button>}
              <button className="btn btn-warning" onClick={() => { setShowUpdateForm(true); setAmount(readObject.budget_amount); setEndDate(readObject.budget_end_date); setTitle(readObject.budget_name); }}>Update Budget</button>
              <button className="btn btn-danger" onClick={() => setShowDeleteForm(true)}>Delete Budget</button>
              <button className="btn btn-secondary" onClick={() => setShowDetails(false)}>Cancel</button>
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

        {addSaving && (
          <Modal show={true} backdrop={false} centered>
            <Modal.Header>
              <Modal.Title>Add to Savings</Modal.Title>
            </Modal.Header>
            <form onSubmit={addtoSaving}>
              <Modal.Body>

                <h4>{readObject.budget_name}</h4>
                <p>Remaining Amount: {formatNumberToPHP(remaining)}</p>
                <p>
                  Budget End Date:{" "}
                  {new Date(readObject.budget_end_date).toLocaleDateString()}
                </p>
                <select
                  className="form-select"
                  id="savings"
                  value={getSavingsIndex}
                  onChange={(e) => setGetSavingsIndex(e.target.value)}>
                  <option value="Choose">Choose</option>
                  {savings.map((savings, index) => {
                    return (
                      <option value={savings.savings_id} key={index}>{savings.savings_name}</option>
                    )
                  })}
                </select>
              </Modal.Body>
              <Modal.Footer>
                <input type="submit" className="btn btn-primary mx-2" value="Add to Savings" />
                <button className="btn btn-primary" onClick={() => setAddSaving(false)}>Cancel</button>
              </Modal.Footer>
            </form>
          </Modal>
        )}



      </div>
    </>
  );
}

export default Budget;
