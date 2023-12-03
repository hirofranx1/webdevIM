import { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BiBell, BiCog } from 'react-icons/bi';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

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
    const [showIntro, setShowIntro] = useState();

    const id = user.user_id;
    const history = useNavigate();
    const gotobudget = () => {
        history('/budget');
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
            progressValue = 100;
            console.log(progressValue);
        } else {
            progressValue = (spent / budgets[selectedIndex].budget_amount) * 100;
            progressValue = 100 - progressValue;
            progressValue = Number(progressValue.toFixed(2));
            console.log(progressValue);
        }
    }


    return (

        <>
            {showIntro && <Intro onClose={handleIntroClose} />}
            <section className="container">
                <hr />
                <div className="row align-items-center">
                    <p className="col-8 text-start"><small>Kamusta,<br /><b>{user ? `${user.firstname} ${user.lastname}` : 'Guest'}</b></small></p>
                    <p className="col-2 text-center"><BiBell size={30} /></p>
                    <p className="col-2 align-center"><BiCog size={30} /></p>
                </div>
                <hr />
            </section>


            <div className="d-flex align-items-center justify-content-center" id="body">
                <Card bg='info' style={{ width: '23rem', borderRadius: '12px' }}>
                    <div className="d-flex justify-content-between p-2">
                        <p className="display-7 fw-bold">Balance</p>
                        <p className="small">Active Wallet</p>
                    </div>

                    <div className="p-2">
                        <p className="display-6 text-center"><b>{progressValue + '%'}</b></p>
                        <ProgressBar animated variant='success' now={progressValue} />
                    </div>
                    <p className='text-center mt-1'><small>You have a remaining budget of</small></p>
                    <p className="display-3 text-center">Php <b>{budgets[selectedIndex] && (budgets[selectedIndex].budget_amount - spent)}</b></p>
                    {spent > (budgets[selectedIndex] && (budgets[selectedIndex].budget_amount)) && <p className="text-center text-danger">You are over budget!</p>}

                    <div className="d-flex text-center mb-2 mx-2">
                        <div className="flex-fill border border-end-1 rounded-start-3 bg-light border-dark">
                            <p className="text-center"><small>Budget</small><br />Php <b>{budgets[selectedIndex] && budgets[selectedIndex].budget_amount}</b></p>
                        </div>
                        <div className="flex-fill border border-start-1 rounded-end-3 bg-light border-dark">
                            <p className="text-center"><small>Expense</small><br />Php <b>{spent}</b></p>
                        </div>
                    </div>
                </Card>
            </div>



            {(hasData) && <select
                value={localStorage.getItem('selectedIndex') || ''}
                onChange={(e) => {
                    setSelectedIndex(e.target.value);
                    localStorage.setItem('selectedIndex', e.target.value);
                    setExpenseForm(false);
                }}>
                {budgets.map((budget, index) => {
                    return (
                        <option key={`${budget.budget_id}-${index}`} value={index}>{budget.budget_name}</option>
                    )
                })}
            </select>}

<div className="d-flex justify-content-center mt-4">

            <button className="btn btn-primary" onClick={gotobudget}>Show Budgets</button>

            <div>
                <button className="btn btn-primary" onClick={toggleExpense}>Add Expense</button>
                <br />
                {expenseForm && (
                    <form onSubmit={handleExpense}>
                        <input type="text" placeholder="Expense Title" className="form-control form-control-lg mt-2" onChange={(e) => setExpenseName(e.target.value)} />
                        <br />

                        <input type="number" placeholder="Expense Amount" className="form-control form-control-lg mt-2" onChange={(e) => setExpenseAmount(e.target.value)} />
                        <br />

                        <label htmlFor="Category">Category </label><br />
                        <select onChange={(e) => setExpenseCategory(e.target.value)}>
                            <option value="Others">Others</option>
                            <option value="Food">Food</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Rent">Rent</option>
                            {/*add category based on chuchu*/};
                        </select>
                        <br />
                        <input type="submit" value="Add" className="btn bg-black text-white" />
                        {error && <p>{error}</p>}
                        <br />
                        <br />
                        <button onClick={toggleExpense} className="btn bg-black text-white">Cancel</button>

                        <br />
                    </form>
                )}

                {/* <p> expenses chuchu </p> */}
                {expense.map((expense, index) => {
                    const utcDate = new Date(expense.expense_time);

                    const LocalDate = utcDate.toLocaleString();
                    return (
                        <div key={index}>
                            <br />
                            <div className="d-flex flex-row justify-content-between">
                                <h4>{expense.expense_name}</h4>
                                <p>Expense Amount: {expense.expense_amount}</p>
                            </div>
                            <p>Category: {expense.expense_category}</p>
                            <p>Date: {LocalDate}</p>
                            <br />
                        </div>
                    )
                })}
            </div>
            <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
            <br />

            </div>
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