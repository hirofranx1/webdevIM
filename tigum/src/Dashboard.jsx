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
    const [showAlert, setShowAlert] = useState(false);
    const [showIntro, setShowIntro] = useState(localStorage.getItem('showIntro') || true);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [getSavings, setGetSavings] = useState([{}]);
    const [getSavingsIndex, setGetSavingsIndex] = useState(0);
    const [addToSavings, setAddToSavings] = useState(false);
    const [readRemain, setReadRemain] = useState(0);
    const [readBudgetId, setReadBudgetId] = useState(0);
    const navOut = localStorage.getItem('navOut');


    const id = user.user_id;
    const history = useNavigate();
    const gotobudget = () => {
        history('/budget');
    }

    const gotoreminders = () => {
        history('/reminders');
    }
    const gotoExpense = () => {
        history('/expenses');
    }
    const gotoSavings = () => {
        history('/savings');
    }
    const gotoSettings = () => {
        history('/settings');
    }


    //intro
    useEffect(() => {
        if (showIntro && navOut === 'true') {
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
        localStorage.setItem('navOut', false);
        console.log(showIntro);
    }

    //get budget data
    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:5000/getbudgets/${id}`)
                .then((response) => {
                    setBudgets(response.data.result);
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
                const totalSpent = response.data.result.reduce((total, expense) => total + expense.expense_amount, 0);
                setSpent(totalSpent);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }, [selectedIndex, budgets]);

    //get savings
    useEffect(() => {
        axios.get(`http://localhost:5000/getsavings/${id}`)
            .then((response) => {
                setGetSavings(response.data.result);
                console.log(response.data.result);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }, [id]);

    console.log(getSavingsIndex);
    //add budget to savings
    async function addToSaving(e) {
        e.preventDefault();
        const savings_id = getSavingsIndex;
        const remaining = readRemain;
        const budget_id = readBudgetId;
        axios.put(`http://localhost:5000/addtosavingsdash`, {remaining, savings_id, budget_id})
            .then((response) => {
                console.log(response.data);
                setAddToSavings(false);
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
        }
    }

    async function deleteBudget(id) {
        const deleteId = id;
        axios.put(`http://localhost:5000/deletebudget/${deleteId}`)
            .then((response) => {
                console.log(response.data);
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


    const toggleExpenseModal = () => {
        setShowExpenseModal(!showExpenseModal);
        setError(""); // Resetting the error state when toggling the modal
    };

    const formatNumberToPHP = (number) => {
        return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(number);
    };

    const [showRightSidebar, setShowRightSidebar] = useState(false);

    const toggleRightSidebar = () => {
        setShowRightSidebar(!showRightSidebar);
    };


    return (

        <>
            {showIntro && <Intro onClose={handleIntroClose} />}
            <section className="container">
                <hr />
                <div className="row align-items-center">
                    <p className="col-8 text-start">
                        <small>Kamusta,<br /><b>{user ? `${user.firstname} ${user.lastname}` : 'Guest'}</b></small>
                    </p>
                    <p className="col-2 text-center"><BiBell id="bell-icon" size={30} style={{ cursor: 'pointer' }}/></p>
                    <p className="col-2 align-center"><BiCog size={30} onClick={gotoSettings} style={{ cursor: 'pointer' }}/></p>
                    <p className="col-2 align-center"><BiCog size={30} onClick={toggleRightSidebar} style={{ cursor: 'pointer' }}/></p>
                </div>
                <hr />
            </section>


            {/* Right Sidebar */}
            <div className={`offcanvas offcanvas-end ${showRightSidebar ? 'show' : ''}`} tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasRightLabel">Right Sidebar</h5>
                    <button type="button" className="btn-close" onClick={toggleRightSidebar} aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    {/* Sidebar content */}
                    {/* Show Reminders */}
                    <button className="btn btn-primary w-100 mb-2" onClick={gotoreminders}>Show Reminders</button>
                    {/* Show Savings */}
                    <button className="btn btn-primary w-100 mb-2" onClick={gotoSavings}>Show Savings</button>
                    {/* Show Budgets */}
                    <button className="btn btn-primary w-100 mb-2" onClick={gotobudget}>Show Budgets</button>
                    {/* Expenses */}
                    <button className="btn btn-primary w-100 mb-2" onClick={gotoExpense}>Expenses</button>
                    {/* Logout */}
                    <button className="btn btn-primary w-100" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div className="d-flex flex-column align-items-center justify-content-center" id="body">
                <Card bg='info' className='my-4' style={{ width: '23rem', borderRadius: '12px' }}>
                    <div className="d-flex justify-content-between p-2">
                        <p className="display-7 fw-bold">Balance</p>
                        <p className="small">Active Wallet</p>
                    </div>

                    <div className="p-2">
                        <p className="display-6 text-center"><b>{(progressValue) ? progressValue : "0"}%</b></p>
                        <ProgressBar animated variant='success' now={progressValue} />
                    </div>
                    <p className='text-center mt-1'><small>You have a remaining budget of</small></p>
                    <p className="display-3 text-center"><b>{(budgets[selectedIndex] && (budgets[selectedIndex].remaining_budget) < budgets[selectedIndex].budget_amount) ? formatNumberToPHP(budgets[selectedIndex] && (budgets[selectedIndex].remaining_budget)) : "0"}</b></p>
                    {spent > (budgets[selectedIndex] && (budgets[selectedIndex].budget_amount)) && <p className="text-center text-danger">You are over budget!</p>}

                    <div className="d-flex text-center mb-2 mx-2">
                        <div className="flex-fill border border-end-1 rounded-start-3 bg-light border-dark">
                            <p className="text-center"><small>Budget</small><br /><b>{(budgets[selectedIndex] && budgets[selectedIndex].budget_amount) ? formatNumberToPHP(budgets[selectedIndex] && budgets[selectedIndex].budget_amount) : "0"}</b></p>
                        </div>
                        <div className="flex-fill border border-start-1 rounded-end-3 bg-light border-dark">
                            <p className="text-center"><small>Expense</small><br /><b>{formatNumberToPHP(spent)}</b></p>
                        </div>
                    </div>
                </Card>



                {/* Dropdown using react-bootstrap */}
                {hasData && (
                    <Dropdown onSelect={(eventKey) => {
                        setSelectedIndex(eventKey);
                        localStorage.setItem('selectedIndex', eventKey);
                        setExpenseForm(false);
                    }} className="my-4" style={{ width: '23rem' }}>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic" style={{ width: '100%' }}>
                            {budgets[selectedIndex]?.budget_name || 'Select Budget'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ width: '100%', minWidth: '23rem' }}>
                            {budgets.map((budget, index) => (
                                <Dropdown.Item
                                    key={`${budget.budget_id}-${index}`}
                                    eventKey={index}
                                    className='text-center'
                                >
                                    {budget.budget_name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                )}


                <br />
                {hasData && <button className="btn btn-primary mx-2" onClick={toggleExpenseModal} >Add Expense</button>}
            </div>

            {/* Expenses list as a table */}
            <div className="d-flex justify-content-center">
                <table className="table table-striped" style={{ maxWidth: '23rem' }}>
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Category</th>
                            <th scope="col">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expense.slice(-3).map((expense, index) => {
                            const utcDate = new Date(expense.expense_time);
                            const LocalDate = utcDate.toLocaleString();

                            return (
                                <tr key={index}>
                                    <td>{expense.expense_name}</td>
                                    <td>{formatNumberToPHP(expense.expense_amount)}</td>
                                    <td>{expense.expense_category}</td>
                                    <td>{LocalDate}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
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

            {budgets.map((budget, index) => {
                const today = new Date();
                const budgetDate = new Date(budget.budget_end_date);
                const id = budget.budget_id;
                if (today > budgetDate) {
                    return (
                        <Modal show={true} key={index}>
                            <Modal.Header closeButton>
                                <Modal.Title>Your budget date has finished, add remaining money to savings?</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>Your budget {budget.budget_name} has expired.</p>

                            </Modal.Body>
                            <Modal.Footer>
                                {budget.remaining_budget > 0 &&
                                <>
                                <Button variant="primary" onClick={() => {setAddToSavings(true);
                                setReadRemain(budget.remaining_budget);
                                setReadBudgetId(id)}} >
                                    Add to Savings
                                </Button>
                                <Button variant="secondary" onClick={() => deleteBudget(id)}>
                                    Keep
                                </Button> 
                                </>
                                }
                                {budget.remaining_budget <= 0 &&
                                <>
                                <Button variant="primary" onClick={() => deleteBudget(id)}>
                                    Okay
                                </Button>
                                </>
                                }
                            </Modal.Footer>
                        </Modal>
                    )
                }
            })}

            {addToSavings &&(
                <Modal show={true} backdrop={false}>
                    <Modal.Header>
                        <Modal.Title>Add to Savings</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={addToSaving}>
                    <Modal.Body>
                        <p>Amount: {readRemain}</p>
                        <p>Choose Savings:</p>
                        <select
                            className="form-select"
                            id="savings"
                            value={getSavingsIndex}
                            onChange={(e) => setGetSavingsIndex(e.target.value)}>
                                <option value="Choose">Choose</option>
                            {getSavings.map((savings, index) => {
                                return (
                                    <option value={savings.savings_id} key={index}>{savings.savings_name}</option>
                                )
                            })}
                            </select>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setAddToSavings(false)}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Add to Savings
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



