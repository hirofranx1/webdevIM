import { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { BsThreeDots } from "react-icons/bs";
import Card from "react-bootstrap/Card";
import { CardBody, CardHeader, ModalFooter } from "react-bootstrap";

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
    const [hasExpense, setHasExpense] = useState(false);
    const [previousExpense, setPreviousExpense] = useState(0);
    const id = user.user_id;
    console.log(id, "id");
    const history = useNavigate();
    const expenseDate = new Date(readObject.expense_time);
    const exDate = expenseDate.toLocaleString();

    const goback = () => {
        history("/dashboard");
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
            console.log(id, "id");
            axios
                .get(`http://localhost:5000/getallexpenses/${id}`)
                .then((response) => {
                    setExpense(response.data.result);
                    setHasExpense(response.data.result.length);
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
        if (diffDays > 7) {
            alert("You can only delete expenses within the past 7 days.");
            return;
        } else {
            const budget_id = readObject.budget_id;
            const previous_expense = previousExpense;
            const data = { expenseName, expenseAmount, expenseCategory, budget_id, previous_expense };
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
    }
    async function deleteExpense(e) {
        if (diffDays > 7) {
            alert("You can only delete expenses within the past 7 days.");
            return;
        } else {
            const deleteId = readObject.expense_id;
            const budget_id = readObject.budget_id;
            const previous_expense = previousExpense;
            axios
                .put(`http://localhost:5000/deleteexpense/${deleteId}`, { budget_id, previous_expense })
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

    const formatNumberToPHP = (number) => {
        return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(number);
    };

    const showScrollspy = expense.length < 10;

    return (
        <>
            <div className="border border-dark rounded-5 p-3 m-5">
                <div className="d-flex justify-content-between align-items-center pb-4 border-bottom border-dark">
                    <Link to="/dashboard" className="btn btn-secondary">
                        Back to Dashboard
                    </Link>
                    <p className="m-0 display-3">Expenses</p>
                    <div></div> {/* This empty div acts as a placeholder to maintain the center alignment */}
                </div>
               
                <div className="container-scrollspy" style={{ maxHeight: "400px", overflowY: "auto" }}>
                {hasExpense > 0 && (
                    <div className="table-responsive">
                        <table className="table table-secondary table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Expense Name</th>
                                    <th>Expense Amount</th>
                                    <th>Date</th>
                                    <th>From Budget</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expense.map((list, index) => {
                                    const today = new Date();
                                    const expenseDate = new Date(list.expense_time);
                                    const differenceInMs = today - expenseDate;
                                    const millisecondsInDay = 1000 * 60 * 60 * 24;
                                    const differenceInDays = differenceInMs / millisecondsInDay;
                                    const utcDate = new Date(list.expense_time);
                                    const LocalDate = utcDate.toLocaleDateString();
                                    return (
                                        <tr key={index} className="border-bottom border-bottom-dark">
                                            <td className="fw-bold">{list.expense_name}</td>
                                            <td data-label="Expense Amount">{formatNumberToPHP(list.expense_amount)}</td>
                                            <td data-label="Date">{LocalDate}</td>
                                            <td data-label="From Budget">
                                                {list.budget_name && list.is_deleted ? (
                                                    <div className="text-decoration-line-through">{list.budget_name}</div>
                                                ) : (
                                                    <div>{list.budget_name}</div>
                                                )}
                                            </td>
                                            <td data-label="Action">
                                                <button
                                                    className="btn"
                                                    onClick={() => {
                                                        setReadObject(list);
                                                        setModalOpen(true);
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
                

                {modalOpen && (
                    <Modal show={true} backdrop={false} centered>
                        <Modal.Body>
                            <div className="d-flex flex-row justify-content-between">
                                <h4>{readObject.expense_name}</h4>
                                <p>Expense Amount: {formatNumberToPHP(readObject.expense_amount)}</p>
                            </div>
                            <p>Date: {exDate}</p>
                            <p>From Budget: {readObject.budget_name}</p>
                            <p>Expense Category: {readObject.expense_category}</p>
                        </Modal.Body>
                        <ModalFooter>
                            <button className="btn btn-warning"
                                onClick={() => {
                                    setopenExpenseUpdateForm(true);
                                    setPreviousExpense(readObject.expense_amount);
                                    setExpenseName(readObject.expense_name);
                                    setExpenseAmount(readObject.expense_amount);
                                    setExpenseCategory(readObject.expense_category);
                                }}
                            >
                                Update
                            </button>
                            <button className="btn btn-danger" onClick={() => {
                                setopenExpenseDeleteForm(true);
                                setPreviousExpense(readObject.expense_amount)
                            }}>
                                Delete
                            </button>
                            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Close</button>
                        </ModalFooter>
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
                                <br />
                                <input
                                    type="text"
                                    onChange={(e) => setExpenseName(e.target.value)}
                                    placeholder={readObject.expense_name}
                                    className="form-control form-control-lg mt-2"
                                />
                                <br />
                                <label>Amount:</label>
                                <br />
                                <input
                                    type="number"
                                    onChange={(e) => setExpenseAmount(e.target.value)}
                                    placeholder={readObject.expense_amount}
                                    className="form-control form-control-lg mt-2"
                                />
                                <br />
                                <p>Current Category: {expenseCategory}  </p>
                                <select
                                    onChange={(e) => setExpenseCategory(e.target.value)}
                                    placeholder={readObject.expense_category}
                                    className="form-select bg-info bg-opacity-10 border border-secondary"
                                >
                                    <option value="Others">Others</option>
                                    <option value="Food">Food</option>
                                    <option value="Transportation">Transportation</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Bills">Bills</option>
                                </select>
                                <input type="submit" className="btn btn-primary m-3" />
                                <button className="btn btn-secondary    " onClick={() => setopenExpenseUpdateForm(false)}>
                                    Close
                                </button>
                            </form>
                            <br />

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
                            <button className='btn btn-danger m-2' onClick={deleteExpense}>YES</button>
                            <button className='btn btn-primary' onClick={() => setopenExpenseDeleteForm(false)}>
                                NO
                            </button>
                        </Modal.Body>
                    </Modal>
                )}
            </div>
        </>
    );
}

export default Expenses;