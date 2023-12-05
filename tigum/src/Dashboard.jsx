import { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BiBell, BiCog } from 'react-icons/bi';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Dropdown, DropdownButton } from 'react-bootstrap';

function Dashboard() {

    const { user, setUser } = useContext(UserContext);
    const [budgets, setBudgets] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(localStorage.getItem('selectedIndex') || 0);
    const [hasData, setHasData] = useState(false);
    const [spent, setSpent] = useState(600);
    const [expenseForm, setExpenseForm] = useState(false);
    const [expenseName, setExpenseName] = useState("");
    const [expenseAmount, setExpenseAmount] = useState(0);
    const [expenseCategory, setExpenseCategory] = useState("Others");
    const [expense, setExpense] = useState([{}]);
    const [error, setError] = useState("");
    const [showIntro, setShowIntro] = useState(localStorage.getItem('showIntro') || true);
    const [showExpenseModal, setShowExpenseModal] = useState(false);

    const id = user.user_id;
    const history = useNavigate();
    const gotobudget = () => {
        history('/budget');
    }

    const gotoreminders = () => {
        history('/reminders');
    }

    //intro
    useEffect(() => {
        if (showIntro) {
            const timeout = setTimeout(() => {
                setShowIntro(false);
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [showIntro]);
    //intro close
    const handleIntroClose = () => {
        setShowIntro(false);
        localStorage.setItem('showIntro', false);
        console.log(showIntro);
    }

    //get budget data
    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:5000/getbudgets/${id}`)
                .then((response) => {
                    setBudgets(response.data.result);
                    console.log(response.data.result.length);
                    if (response.data.result.length > 0) {
                        setHasData(true);
                    }
                })
                .catch((error) => {
                    console.log(error.message);
                });
        }
    }, [id]);

    //check if user is logged in
    useEffect(() => {
        function checkUser() {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
                return;
            }
            else {
                history('/');
            }
        }
        checkUser();
    }, [])

    //logout
    const handleLogout = () => {
        setUser({
            user_id: "",
        });
        localStorage.removeItem("user");
        localStorage.removeItem("selectedIndex");
        localStorage.removeItem("showIntro");
        history('/');
        console.log(user);
    } 

    //toggle expense form
    const toggleExpense = () => {
        setExpenseForm(!expenseForm);
        setError("");
    }

    //add expense
    async function handleExpense(e) {
        e.preventDefault();
        if (expenseAmount <= 0) {
            return setError("Please input valid amount");
        }
        if (expenseName === "") {
            return setError("Please Input title");
        }
        const bud_id = (budgets[selectedIndex] && budgets[selectedIndex].budget_id);
        console.log(bud_id);

        axios.post("http://localhost:5000/addexpense", { bud_id, expenseName, expenseAmount, expenseCategory })
            .then((response) => {
                console.log(response.data);
                toggleExpense(!expenseForm);
                window.location.reload();
            }).catch((error) => {
                console.log(error);
                if (error.response) {
                    setError(error.response.data.message);
                } else {
                    setError("Something went wrong");
                }
            });
    }

    //get expenses
    useEffect(() => {
        const budId = budgets[selectedIndex] && budgets[selectedIndex].budget_id;
        console.log(budId);
        axios.get(`http://localhost:5000/getexpenses/${budId}`)
            .then((response) => {
                setExpense(response.data.result);
                console.log(response.data.result);
                const totalSpent = response.data.result.reduce((total, expense) => total + expense.expense_amount, 0);
                setSpent(totalSpent);
                console.log(totalSpent);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }, [selectedIndex, budgets]);

    //progress bar
    let progressValue;
    if (budgets[selectedIndex]) {
        if (Number(spent) > Number(budgets[selectedIndex].budget_amount)) {
            progressValue = 0;
            console.log(progressValue);
        } else {
            progressValue = (spent / budgets[selectedIndex].budget_amount) * 100;
            progressValue = 100 - progressValue;
            progressValue = Number(progressValue.toFixed(2));
            console.log(progressValue);
        }
    }

    const toggleExpenseModal = () => {
        setShowExpenseModal(!showExpenseModal);
        setError(""); // Resetting the error state when toggling the modal
    };

    const formatNumberToPHP = (number) => {
        return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(number);
      };
    


    return (

        <>
            {showIntro && <Intro onClose={handleIntroClose} />}
            <section className="container">
                <hr />
                <div className="row align-items-center">
                    <p className="col-8 text-start"><small>Kamusta,<br /><b>{user ? `${user.firstname} ${user.lastname}` : 'Guest'}</b></small></p>
                    <p className="col-2 text-center"><BiBell size={30} /></p>
                    <p className="col-2 align-center"><BiCog size={30} /></p>
                    <button className="btn btn-primary" onClick={gotoreminders}>Show Reminders</button>
                </div>
                <hr />
            </section>


            <div className="d-flex flex-column align-items-center justify-content-center" id="body">
                <Card bg='info' className='my-4' style={{ width: '23rem', borderRadius: '12px' }}>
                    <div className="d-flex justify-content-between p-2">
                        <p className="display-7 fw-bold">Balance</p>
                        <p className="small">Active Wallet</p>
                    </div>

                    <div className="p-2">
                        <p className="display-6 text-center"><b>{progressValue + '%'}</b></p>
                        <ProgressBar animated variant='success' now={progressValue} />
                    </div>
                    <p className='text-center mt-1'><small>You have a remaining budget of</small></p>
                    <p className="display-3 text-center"><b>{formatNumberToPHP(budgets[selectedIndex] && (budgets[selectedIndex].budget_amount - spent))}</b></p>
                    {spent > (budgets[selectedIndex] && (budgets[selectedIndex].budget_amount)) && <p className="text-center text-danger">You are over budget!</p>}

                    <div className="d-flex text-center mb-2 mx-2">
                        <div className="flex-fill border border-end-1 rounded-start-3 bg-light border-dark">
                            <p className="text-center"><small>Budget</small><br /><b>{formatNumberToPHP(budgets[selectedIndex] && budgets[selectedIndex].budget_amount)}</b></p>
                        </div>
                        <div className="flex-fill border border-start-1 rounded-end-3 bg-light border-dark">
                            <p className="text-center"><small>Expense</small><br /><b>{formatNumberToPHP(spent)}</b></p>
                        </div>
                    </div>
                </Card>

                {(hasData) && (
                    // <div className="d-flex align-items-center justify-content-center mb-4">
                    <select
                        value={localStorage.getItem('selectedIndex') || ''}
                        onChange={(e) => {
                            setSelectedIndex(e.target.value);
                            localStorage.setItem('selectedIndex', e.target.value);
                            setExpenseForm(false);
                        }}
                        style={{ width: '23rem' }} // Adjust the width as needed
                    >
                        {budgets.map((budget, index) => {
                            return (
                                <option key={`${budget.budget_id}-${index}`} value={index} className='text-center'>{budget.budget_name}</option>
                            )
                        })}
                    </select>
                )}
            </div>

{/* Expenses list */}
<a href='/expenses' className="d-flex flex-column align-items-center link-underline link-underline-opacity-0">
    {expense.slice(0, 3).map((expense, index) => { // Use slice(-3) to get the last three items
        const utcDate = new Date(expense.expense_time);
        const LocalDate = utcDate.toLocaleString();

        return (
            <div key={index} className='w-100 mb-3 border-bottom border-dark' style={{ maxWidth: '23rem' }}>
                <ul className='list-group list-group-flush'>
                    <li className='list-group-item d-flex flex-column'>
                        <div className='d-flex flex-row justify-content-between'>
                            <h4>{expense.expense_name}</h4>
                            <p>Expense Amount: {formatNumberToPHP(expense.expense_amount)}</p>
                        </div>
                        <p>Category: {expense.expense_category}</p>
                        <p>Date: {LocalDate}</p>
                    </li>
                </ul>
            </div>
        )
    })}
</a>

            <div className="d-flex justify-content-center mt-4">
                <button className="btn btn-primary" onClick={gotobudget}>Show Budgets</button>
                <button className="btn btn-primary mx-2" onClick={toggleExpenseModal}>Add Expense</button>
                <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
                <br />

            </div>

            {showExpenseModal && (
                <Modal show={true} onHide={toggleExpenseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Expense</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={handleExpense}>
                        <Modal.Body>
                            <div className="mb-3">
                                <label htmlFor="expenseName" className="form-label">Expense Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="expenseName"
                                    onChange={(e) => setExpenseName(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="expenseAmount" className="form-label">Expense Amount</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="expenseAmount"
                                    value={expenseAmount}
                                    onChange={(e) => setExpenseAmount(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="expenseCategory" className="form-label">Expense Category</label>
                                <select
                                    className="form-select"
                                    id="expenseCategory"
                                    value={expenseCategory}
                                    onChange={(e) => setExpenseCategory(e.target.value)}
                                >
                                    <option value="Food">Food</option>
                                    <option value="Transportation">Transportation</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                            {error && <p className="text-danger">{error}</p>}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={toggleExpenseModal}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit">
                                Add Expense
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            
            )}


        </>
    )
}

function Intro({ onClose }) {
    return (
        <>
            <Modal show={true} onHide={onClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Welcome to Tigum Pinas</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    Take Control of Your Finances with Budget Genius.
                    <br /><br />
                    Stay on top of your finances and achieve your financial goals.
                    <br /><br />
                    Secure your financial future and take charge of your money.
                    <br /><br />
                    Eliminate financial stress and never overspend again.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}



export default Dashboard;



