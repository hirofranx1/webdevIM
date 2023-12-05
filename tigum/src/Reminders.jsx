import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Modal, Row, Col, Card } from 'react-bootstrap';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';

function Reminders() {
  const { user, setUser } = useContext(UserContext);
  const [budgets, setBudgets] = useState([{}]);
  const [reminderName, setReminderName] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderAmount, setReminderAmount] = useState("");
  const [reminderBudget, setReminderBudget] = useState();
  const [reminderDescription, setReminderDescription] = useState("");
  const [reminderBudgetName, setReminderBudgetName] = useState("");
  const [reminderBudgetId, setReminderBudgetId] = useState("");
  const [reminders, setReminders] = useState([{}]);
  const [reminderObject, setReminderObject] = useState({});
  const [payForm, setPayForm] = useState(false);
  const [updateForm, setUpdateForm] = useState(false);
  const [deleteForm, setDeleteForm] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReminderDate, setSelectedReminderDate] = useState(null);

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
          console.log(response.data.result);
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
          console.log(response.data.result);
          setReminders(response.data.result);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  }, [id]);
  console.log(reminderBudget);
  async function addReminder(e) {
    e.preventDefault();
    const budget = reminderBudget;
    setReminderBudgetId(budget.budget_id);
    setReminderBudgetName(budget.budget_name);
    console.log(reminderBudgetId);
    console.log(reminderBudgetName);
    if(reminderBudget === ""){
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
      bud_name: reminderBudgetName,
      bud_id: reminderBudgetId,
      reminder_description: reminderDescription,
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

  return (
    <Container className="d-flex justify-content-center mt-4">
      <Card border="info" style={{ borderRadius: '5px', maxWidth: '400px' }}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Reminders</h2>
            <div>
              <button className="btn btn-secondary me-2" onClick={back}>Back</button>
              <button className="btn btn-primary" onClick={() => {
                setShowRemindForm(true);
                setReminderBudget(budgets[0].budget_name);
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
                    <label htmlFor="reminderDescription" className="form-label">Reminder Description</label>
                    <input
                      type="text"
                      id="reminderDescription"
                      className="form-control"
                      onChange={(e) => setReminderDescription(e.target.value)}
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
                    <label htmlFor="reminderBudget" className="form-label">Reminder Budget</label>
                    <select
                      id="reminderBudget"
                      className="form-select"
                      onChange={(e) => setReminderBudget(e.target.value)}
                    >
                      {budgets.map((budget, index) => {
                        return (
                          <option
                            key={`${budget.budget_id}-${index}`}
                            value={budget.budget_name}
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
                <button onClick={() => setShowRemindForm(false)} className="btn btn-secondary">Close</button>
              </Modal.Body>
            </Modal>
          )}

          <div className="mt-3">
            <Container className="text-center">
              <Row>
                <Col>
                  <div className="border border-info rounded-3 p-3">
                    <Calendar />
                  </div>
                </Col>
              </Row>
            </Container>
          </div>

          {/* Display reminders */}
          {reminders.map((reminder, index) => {
            return (
              <div key={`${reminder.reminder_id}-${index}`}>
                <div>Reminder Name: {reminder.reminder_name}</div>
                <div>Reminder Amount: {reminder.reminder_amount}</div>
                <div>
                  Reminder Date:{" "}
                  {new Date(reminder.reminder_date).toLocaleDateString()}
                </div>
                <div>Reminder Budget: {reminder.bud_name}</div>
                <div>Reminder Description: {reminder.reminder_description}</div>
                <br />
              </div>
            );
          })}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Reminders;