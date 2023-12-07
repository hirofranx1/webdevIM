import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Modal, Row, Col, Card } from 'react-bootstrap';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import { BsThreeDots } from "react-icons/bs";


function Reminders() {

  const { user, setUser } = useContext(UserContext);
  const [budgets, setBudgets] = useState([{}]);
  const [reminderName, setReminderName] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderAmount, setReminderAmount] = useState("");
  const [reminderBudget, setReminderBudget] = useState({});
  const [reminders, setReminders] = useState([{}]);
  const [reminderObject, setReminderObject] = useState({});
  const [reminderCategory, setReminderCategory] = useState("Others");
  const [payForm, setPayForm] = useState(false);
  const [updateForm, setUpdateForm] = useState(false);
  const [deleteForm, setDeleteForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState("");
  const [showRemindForm, setShowRemindForm] = useState(false);


  const id = user.user_id;
  const history = useNavigate();
  const back = () => {
    history("/dashboard");
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/getbudgets/${id}`)
        .then((response) => {
          setBudgets(response.data.result);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/getreminders/${id}`)
        .then((response) => {
          setReminders(response.data.result);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, [id]);


  console.log(reminderBudget);
  console.log(reminderName + ": reminderName");
  async function addReminder(e) {
    e.preventDefault();
    if (reminderBudget === "") {
      setError("Please select a budget");
      return;
    }
    if (reminderName === "") {
      setError("Please enter a reminder name");
      return;
    }
    if (reminderAmount === "") {
      setError("Please enter a reminder amount");
      return;
    }
    if (reminderAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (new Date().getTime() > new Date(reminderDate).getTime()) {
      setError("Please enter a valid date");
      return;
    }

    const reminder = {
      reminder_name: reminderName,
      reminder_date: reminderDate,
      reminder_amount: reminderAmount,
      bud_name: reminderBudget.budget_name,
      bud_id: reminderBudget.budget_id,
      reminder_category: reminderCategory,
      user_id: id,
    };

    console.log(reminder);
    axios
      .post("http://localhost:5000/addreminder", reminder)
      .then((response) => {
        console.log(response.data.result);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  async function payReminder(e) {
    e.preventDefault();
    const reminder = {
      reminder_id: reminderObject.reminder_id,
      reminder_name: reminderObject.reminder_name,
      reminder_amount: reminderObject.reminder_amount,
      bud_id: reminderObject.budget_id,
      reminder_category: reminderObject.reminder_category,
    };

    console.log(reminder);
    axios
      .post("http://localhost:5000/payreminder", reminder)
      .then((response) => {
        console.log(response.data.result);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  async function updateReminder(e) {
    e.preventDefault();
    if(reminderAmount <= 0){
      setError("Please enter a valid amount");
      return;
    }

    const reminder = {
      reminder_id: reminderObject.reminder_id,
      reminder_name: reminderName,
      reminder_date: reminderDate,
      reminder_amount: reminderAmount,
      bud_id: reminderBudget.budget_id,
      budget_name: reminderBudget.budget_name,
      reminder_category: reminderCategory,
    };

    console.log(reminder);
    axios
      .put("http://localhost:5000/updatereminder", reminder)
      .then((response) => {
        console.log(response.data.result);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  async function deleteReminder(e) {
    e.preventDefault();
    const id = reminderObject.reminder_id;

    axios.delete(`http://localhost:5000/deletereminder/${id}`)
      .then((response) => {
        console.log(response.data.result);
        window.location.reload();
      }).catch((error) => {
        console.log(error.message);
      });
  }

  // Sort reminders by date, closest date first
  const sortedReminders = [...reminders].sort((a, b) => {
    const dateA = new Date(a.reminder_date).getTime();
    const dateB = new Date(b.reminder_date).getTime();
    return dateA - dateB;
  });

  return (
    <Container className="d-flex justify-content-center mt-4">
      <Card border="info" style={{ borderRadius: '5px', maxWidth: '600px' }}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Reminders</h2>
            <div>
              <button className="btn btn-secondary me-2" onClick={back}>Back</button>
              <button className="btn btn-primary" onClick={() => {
                setShowRemindForm(true);
                setReminderBudget({ budget_name: budgets[0].budget_name, budget_id: budgets[0].budget_id });
              }}>Add Reminder</button>
            </div>
          </div>

          {showRemindForm && (
            <Modal show={showRemindForm} onHide={() => setShowRemindForm(false)}>
              <Modal.Header>
                <Modal.Title>Add Reminder</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={addReminder}>
                  <div className="mb-3">
                    <label htmlFor="reminderName" className="form-label">Reminder Name</label>
                    <input
                      type="text"
                      id="reminderName"
                      className="form-control"
                      required
                      onChange={(e) => setReminderName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="reminderAmount" className="form-label">Reminder Amount</label>
                    <input
                      type="text"
                      id="reminderAmount"
                      className="form-control"
                      required
                      onChange={(e) => setReminderAmount(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="reminderDate" className="form-label">Reminder Date</label>
                    <input
                      type="date"
                      id="reminderDate"
                      className="form-control"
                      required
                      onChange={(e) => setReminderDate(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="reminderDate" className="form-label">Reminder Date</label>
                    <select onChange={(e) => setReminderCategory(e.target.value)} className="form-select">
                      <option value="Others">Others</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Food">Food</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="reminderBudget" className="form-label">Reminder Budget</label>
                    <select
                      id="reminderBudget"
                      className="form-select"
                      onChange={(e) => {
                        const budget = JSON.parse(e.target.value);
                        setReminderBudget(budget)
                      }}
                    >
                      {budgets.map((budget, index) => {
                        return (
                          <option
                            key={`${budget.budget_id}-${index}`}
                            value={JSON.stringify({ budget_name: budget.budget_name, budget_id: budget.budget_id })}
                            className="text-center"
                          >
                            {budget.budget_name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <button type="submit" className="btn btn-primary">Add Reminder</button>
                    {error && <div className="error">{error}</div>}
                  </div>
                </form>
                <button onClick={() => {setShowRemindForm(false); setError("")}} className="btn btn-secondary">Close</button>
              </Modal.Body>
            </Modal>
          )}

          {/* Display reminders in a table sorted by closest date */}
          <table className="table mt-3">
            <thead>
              <tr>
                <th>Reminder Name</th>
                <th>Reminder Amount</th>
                <th>Pay Before</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedReminders.map((reminder, index) => (
                <tr key={`${reminder.reminder_id}-${index}`}>
                  <td>{reminder.reminder_name}</td>
                  <td>{reminder.reminder_amount}</td>
                  <td>{new Date(reminder.reminder_date).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn"
                      onClick={() => {
                        setReminderObject(reminder);
                        setShowDetails(true);
                      }}
                    >
                      <BsThreeDots size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </Card.Body>
      </Card>
      {showDetails && (
        <Modal show={showDetails} onHide={() => setShowDetails(false)}>
          <Modal.Header>
            <Modal.Title>{reminderObject.reminder_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>Reminder Name: {reminderObject.reminder_name}</div>
            <div>Reminder Amount: {reminderObject.reminder_amount}</div>
            <div>
              Pay Before:{" "}
              {new Date(reminderObject.reminder_date).toLocaleDateString()}
            </div>
            <div>Reminder Category: {reminderObject.reminder_category}</div>
            <div>Reminder Budget: {reminderObject.budget_name}</div>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={() => setPayForm(true)} className="btn btn-primary">Pay</button>
            <button className="btn btn-primary" onClick={() => {
              setUpdateForm(true)
              setReminderName(reminderObject.reminder_name)
              setReminderDate(reminderObject.reminder_date)
              setReminderAmount(reminderObject.reminder_amount)
              setReminderCategory(reminderObject.reminder_category)
              setReminderBudget({ budget_name: reminderObject.budget_name, budget_id: reminderObject.budget_id })
            }}>Update</button>
            <button className="btn btn-primary" onClick={() => { setDeleteForm(true) }}>Delete</button>
            <button onClick={() => setShowDetails(false)} className="btn btn-primary">Close</button>
          </Modal.Footer>
        </Modal>
      )}

      {payForm && (
        <Modal show={payForm} onHide={() => setPayForm(false)}>
          <Modal.Header>
            <Modal.Title>{reminderObject.reminder_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={payReminder}>
              <div>Amount: {reminderObject.reminder_amount}</div>
              <div>
                Pay Before:{" "}
                {new Date(reminderObject.reminder_date).toLocaleDateString()}
              </div>
              <div>Category: {reminderObject.reminder_category}</div>
              <div>Budget: {reminderObject.budget_name}</div>

              <br />

              <Modal.Footer>
                <div><button type="submit" className="btn btn-primary">Pay</button></div>
                <div><button onClick={() => setPayForm(false)} className="btn btn-primary">Close</button></div>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </Modal>
      )}
      {updateForm && (
        <Modal show={updateForm} onHide={() => setUpdateForm(false)}>
          <Modal.Header>
            <Modal.Title>{reminderObject.reminder_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={updateReminder}>
              <div>
                <label htmlFor="reminderName" className="form-label">Reminder Name</label>
                <input
                  type="text"
                  id="reminderName"
                  className="form-control"
                  placeholder={reminderObject.reminder_name}
                  onChange={(e) => setReminderName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="reminderAmount" className="form-label">Reminder Amount</label>
                <input
                  type="text"
                  id="reminderAmount"
                  className="form-control"
                  placeholder={reminderObject.reminder_amount}
                  onChange={(e) => setReminderAmount(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="reminderDate" className="form-label">Reminder Date:(Current){new Date(reminderObject.reminder_date).toLocaleDateString()}</label>
                <input
                  type="date"
                  id="reminderDate"
                  className="form-control"
                  onChange={(e) => setReminderDate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="reminderDate" className="form-label">Category: (Current){reminderObject.reminder_category}</label>
                <select onChange={(e) => setReminderCategory(e.target.value)} className="form-select">
                  <option value="Others">Others</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Food">Food</option>
                </select>
              </div>
              <div>
                <label htmlFor="reminderBudget" className="form-label">Budget: (Current){reminderBudget.budget_name}</label>
                <select
                  id="reminderBudget"
                  className="form-select"
                  onChange={(e) => {
                    const budget = JSON.parse(e.target.value);
                    setReminderBudget(budget)
                  }}
                >
                  {budgets.map((budget, index) => {
                    return (
                      <option
                        key={`${budget.budget_id}-${index}`}
                        value={JSON.stringify({ budget_name: budget.budget_name, budget_id: budget.budget_id })}
                        className="text-center"
                      >
                        {budget.budget_name}
                      </option>
                    );
                  })}
                </select>
                {error && <p className="text-danger">{error}</p>}
              </div>
              {error && <p className="text-danger">{error}</p>}
              <Modal.Footer>
                <input type="submit" className="btn btn-primary" value="Update" />
                <button onClick={() => {setUpdateForm(false); setError("")}} className="btn btn-primary">Close</button>
              </Modal.Footer>
            </form>
          </Modal.Body>

        </Modal>
      )}

      {deleteForm && (
        <Modal show={deleteForm} onHide={() => setDeleteForm(false)}>
          <Modal.Header>
            <Modal.Title><div>Are you sure you want to delete this reminder?</div></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div><h3>{reminderObject.reminder_name}</h3></div>
            <div>Reminder Amount: {reminderObject.reminder_amount}</div>
            <div>
              Pay Before:{" "}
              {new Date(reminderObject.reminder_date).toLocaleDateString()}
            </div>
            <div>Reminder Category: {reminderObject.reminder_category}</div>
            <div>Reminder Budget: {reminderObject.budget_name}</div>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={deleteReminder} className="btn btn-primary">Delete</button>
            <button onClick={() => setDeleteForm(false)} className="btn btn-primary">Close</button>
          </Modal.Footer>
        </Modal>
      )}


    </Container>
  );
}

export default Reminders;


