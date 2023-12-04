import { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { BsThreeDots } from "react-icons/bs";
import Card from "react-bootstrap/Card";
import { CardBody, CardHeader } from "react-bootstrap";

function Expenses() {
  const [expense, setExpense] = useState([{}]);
  const [modalOpen, setModalOpen] = useState(false);
  const [openExpenseUpdateForm, setopenExpenseUpdateForm] = useState(false);
  const [openExpenseDeleteForm, setopenExpenseDeleteForm] = useState(false);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [readObject, setReadObject] = useState({});
  const { user, setUser } = useContext(UserContext);
  const id = user.user_id;
  console.log(id, "id");
  const history = useNavigate();
  const expenseDate = new Date(readObject.expense_time);
  const exDate = expenseDate.toLocaleString();

  const goback = () => {
    history("/dashboard");
  };

  useEffect(() => {
    if (id) {
      console.log(id, "id");
      axios
        .get(`http://localhost:5000/getallexpenses/${id}`)
        .then((response) => {
          setExpense(response.data.result);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }
  }, [id]);

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

  async function updateExpense(e) {
    const data = { expenseName, expenseAmount, expenseCategory };
    const updateId = readObject.expense_id;
    axios
      .put(`http://localhost:5000/updateexpense/${updateId}`, data)
      .then((response) => {
        console.log(response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }

  async function deleteExpense(e) {
    if (diffDays > 7) {
      alert("You can only delete expenses within the past 7 days.");
      return;
    } else {
      const deleteId = readObject.expense_id;
      axios
        .delete(`http://localhost:5000/deleteexpense/${deleteId}`)
        .then((response) => {
          console.log(response.data);
          window.location.reload();
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }
  }

  const elapsedTime = new Date(readObject.expense_time);
  const today = new Date();
  const diffDays = (today - elapsedTime) / (1000 * 60 * 60 * 24);
  console.log(diffDays, "diffDays");

  return (
    <>
      <Card className="bg-info m-4">
        <CardHeader>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={goback}
          ></button>
          <h1 className="d-flex justify-content-center">Expenses</h1>
        </CardHeader>

        <CardBody>
          {expense.map((list, index) => {
            const utcDate = new Date(list.expense_time);
            const LocalDate = utcDate.toLocaleDateString();
            const ComDate = utcDate.toLocaleString();
            return (
              <div key={index} className="border-bottom border-bottom-dark">
                <br />
                <div className="d-flex flex-row justify-content-between">
                  <h4>{list.expense_name}</h4>
                  <p>Expense Amount: {list.expense_amount}</p>
                  <div>
                    <button
                      onClick={() => {
                        setReadObject(list);
                        setModalOpen(true);
                      }}
                    >
                      <BsThreeDots size={20} />
                    </button>
                  </div>
                </div>

                <div className="d-flex flex-row justify-content-between">
                  <div>
                    <p>Date: {LocalDate}</p>
                    <p>
                      From Budget: {list.budget_name}{" "}
                      {list.is_deleted ? "(Budget Deleted)" : ""}
                    </p>
                  </div>
                </div>
                <br />
                {modalOpen && (
                  <Modal show={true} backdrop={false} centered>
                    <Modal.Body>
                      <div className="d-flex flex-row justify-content-between">
                        <h4>{readObject.expense_name}</h4>
                        <p>Expense Amount: {readObject.expense_amount}</p>
                      </div>
                      <p>Date: {exDate}</p>
                      <p>From Budget: {readObject.budget_name}</p>
                      <br />
                      <p>Expense Category: {readObject.expense_category}</p>
                      <button
                        onClick={() => {
                          setopenExpenseUpdateForm(true);
                          setExpenseName(readObject.expense_name);
                          setExpenseAmount(readObject.expense_amount);
                          setExpenseCategory(readObject.expense_category);
                        }}
                      >
                        Update
                      </button>
                      <button onClick={() => setopenExpenseDeleteForm(true)}>
                        Delete
                      </button>
                      <button onClick={() => setModalOpen(false)}>Close</button>
                    </Modal.Body>
                  </Modal>
                )}
                {openExpenseUpdateForm && (
                  <Modal show={true} backdrop={false} centered>
                    <Modal.Header>
                      <Modal.Title>Update Expense</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <form onSubmit={updateExpense}>
                        <label>Name:</label>
                        <input
                          type="text"
                          onChange={(e) => setExpenseName(e.target.value)}
                          placeholder={readObject.expense_name}
                        />
                        <br />
                        <label>Amount:</label>
                        <input
                          type="number"
                          onChange={(e) => setExpenseAmount(e.target.value)}
                          placeholder={readObject.expense_amount}
                        />
                        <br />
                        <label>Category:</label>
                        <input type="text" value={expenseCategory} />
                        <select
                          onChange={(e) => setExpenseCategory(e.target.value)}
                          placeholder={readObject.expense_category}
                        >
                          <option value="Others">Others</option>
                          <option value="Food">Food</option>
                          <option value="Transportation">Transportation</option>
                          <option value="Utilities">Utilities</option>
                          <option value="Rent">Rent</option>
                        </select>
                        <br />
                        <input type="submit" />
                      </form>
                      <button onClick={() => setopenExpenseUpdateForm(false)}>
                        CLOSE
                      </button>
                    </Modal.Body>
                  </Modal>
                )}
                {openExpenseDeleteForm && (
                  <Modal show={true} backdrop={false} centered>
                    <Modal.Header>
                      <Modal.Title>Delete Expense</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <p>Are you sure you want to delete this expense?</p>
                      <button onClick={deleteExpense}>YES</button>
                      <button onClick={() => setopenExpenseDeleteForm(false)}>
                        NO
                      </button>
                    </Modal.Body>
                  </Modal>
                )}
              </div>
            );
          })}
        </CardBody>
      </Card>
    </>
  );
}

export default Expenses;
