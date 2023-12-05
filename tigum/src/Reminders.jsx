import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";

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
    if(reminderName === ""){
        setError("Please enter a reminder name");
        return;
    }
    if(reminderAmount === ""){
        setError("Please enter a reminder amount");
        return;
    }
    if(reminderAmount <= 0){
        setError("Please enter a valid amount");
        return;
    }
    if(new Date().getTime() > new Date(reminderDate).getTime()){
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
    <>
      <div>Reminders</div>
      <button onClick={back}> Back </button>

      <button onClick={() => {setShowRemindForm(true)
        setReminderBudget({budget_name: budgets[0].budget_name, budget_id: budgets[0].budget_id});
    } }>Add Reminder</button>

      {showRemindForm && (
        <Modal show={showRemindForm} onHide={() => setShowRemindForm(false)}>
          <Modal.Header>
            <Modal.Title>Add Reminder</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={addReminder}>
              <label>Reminder Name</label>
              <br />
              <input
                type="text"
                required
                onChange={(e) => setReminderName(e.target.value)}
              />
              <br />
              <label>Reminder Amount</label>
              <br />
              <input
                type="text"
                required
                onChange={(e) => setReminderAmount(e.target.value)}
              />
              <br />
              <label>Reminder Description</label>
              <br />
              <input
                type="text"
                onChange={(e) => setReminderDescription(e.target.value)}
              />
              <br />
              <br />
              <input
                type="date"
                required
                onChange={(e) => setReminderDate(e.target.value)}
              />
              <br />
              <label>Reminder Budget: </label>
              <br />
              <select onChange={(e) => {
                const budget = JSON.parse(e.target.value);
                console.log(budget);
                setReminderBudget(budget)
            }}>
                {budgets.map((budget, index) => {
                  return (
                    <option
                      key={`${budget.budget_id}-${index}`}
                      value={JSON.stringify({budget_name: budget.budget_name, budget_id: budget.budget_id})}
                      className="text-center"
                    >
                      {budget.budget_name}
                    </option>
                  );
                })}
              </select>
              <br />
              <br />

              <input type="submit" value="Add Reminder" />
              {error && <div className="error">{error}</div>}
            </form>
            <br />
            <button onClick={() => setShowRemindForm(false)}>Close</button>
          </Modal.Body>
        </Modal>
      )}

      {reminders.map((reminder, index) => {
        return (
          <div key={`${reminder.reminder_id}-${index}`}>
            <div>Reminder Name: {reminder.reminder_name}</div>
            <div>Reminder Amount: {reminder.reminder_amount}</div>
            <div>
              Reminder Date:{" "}
              {new Date(reminder.reminder_date).toLocaleDateString()}
            </div>
            <div>Reminder Budget: {reminder.budget_name}</div>
            <div>Reminder Description: {reminder.reminder_description}</div>
            <br />
            <button onClick={() => {setPayForm(true)
            setReminderObject(reminder)}}>Pay</button>
            <button>Update</button>
            <button>Delete</button>
          </div>
        );
      })}

      {payForm && (
        <Modal show={payForm} onHide={() => setPayForm(false)}>
          <Modal.Header>
            <Modal.Title>{reminderObject.reminder_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <br />
              <label>Amount</label>
              <br />
              <h2>{reminderObject.reminder_amount} </h2>
              <input type="hidden"/>
              <br />
              <label>Description</label>
              <br />
              <h2>{reminderObject.reminder_description}</h2>
              <br />
              <label>Date</label>
              <br />
              <h2>{new Date(reminderObject.reminder_date).toLocaleDateString()}</h2>
              <br />
              <label>Budget</label>
              <br />
              <h2>{reminderObject.reminder_description}</h2>
              <br />
              <input type="submit" value="Pay Reminder" />
            </form>
            <br />
            <button onClick={() => setPayForm(false)}>Close</button>
          </Modal.Body>
        </Modal>
      )}



    </>
  );
}

export default Reminders;
