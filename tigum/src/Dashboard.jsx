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
import { GiHamburgerMenu } from "react-icons/gi";

function Dashboard() {

    const { user, setUser } = useContext(UserContext);
    const [getUser, setGetUser] = useState([{}]);
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
    const [getSavings, setGetSavings] = useState([{}]);
    const [getSavingsIndex, setGetSavingsIndex] = useState(0);
    const [hasSavings, setHasSavings] = useState(0);
    const [title, setTitle] = useState("");
    const [endDate, setEndDate] = useState(new Date());
    const [addToSavings, setAddToSavings] = useState(false);
    const [addToBudget, setAddToBudget] = useState(false);
    const [readRemain, setReadRemain] = useState(0);
    const [readBudgetId, setReadBudgetId] = useState(0);
    const [hasExpense, setHasExpense] = useState(0);
    const [calendar, setCalender] = useState(false);
    const navOut = localStorage.getItem('navOut');
    const openCalendar = () => {
        setCalender(true);
      };

    const id = user.user_id;
    const history = useNavigate();
    const gotobudget = () => {
        history('/budget');
    }

    useEffect(() => {
        if(id)
        axios.get(`http://localhost:5000/getuser/${id}`)
            .then((response) => {
                setGetUser(response.data.user);
                console.log(response.data.user);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }, [id]);



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
        if (showIntro === 'true' && navOut === 'true') {
            const timeout = setTimeout(() => {
                setShowIntro(false);

            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [showIntro]);
    //intro close
    const handleIntroClose = () => {
        setShowIntro(false);
        localStorage.setItem("showIntro", JSON.stringify(false));
        localStorage.setItem('navOut', false);
        console.log(showIntro);
    }

    //get budget data
    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:5000/getbudgetsdash/${id}`)
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
                setHasExpense(response.data.result.length)
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
                setHasSavings(response.data.result.length);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }, [id]);


    //add budget to savings
    async function addToSaving(e) {
        e.preventDefault();
        const savings_id = getSavingsIndex;
        const remaining = readRemain;
        const budget_id = readBudgetId;
        axios.put(`http://localhost:5000/addtosavingsdash`, { remaining, savings_id, budget_id })
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
    console.log(readBudgetId);
    async function addToBudgetRem(e) {
        e.preventDefault();
        if(title === "") {
            return setError("Please input title");
        }
        if(readRemain <= 0) {
            return setError("Please input valid amount");
        }
        const bud_id = readBudgetId;
        
        const amount = readRemain;
        const startDate = new Date();
        axios.post(`http://localhost:5000/addbudgetandDelete`, { id , title, amount, startDate, endDate, bud_id })
            .then((response) => {
                console.log(response.data);
                setAddToBudget(false);
                window.location.reload();
            }).catch((error) => {
                console.log(error.response);
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
            {showIntro === "true" && <Intro onClose={handleIntroClose} />}
        
            <section className="container">
                <hr />
                <div className="row align-items-center">
                    <div className="col-8">
                        <p className="text-start"><small>Kamusta,<br /><b>{getUser ? `${getUser.firstname} ${getUser.lastname}` : 'Guest'}</b></small></p>
                    </div>
                    <div className="col-2 text-end">
                        <p><BiBell id="bell-icon" onClick={gotoreminders} size={30} style={{ cursor: 'pointer' }} /></p>
                    </div>
                    <div className="col-1 text-end">
                        <p><BiCog size={30} onClick={gotoSettings} style={{ cursor: 'pointer' }} /></p>
                    </div>
                    <div className="col-1 text-end">
                        <p><GiHamburgerMenu size={30} onClick={toggleRightSidebar} style={{ cursor: 'pointer' }} /></p>
                    </div>
                </div>

                <hr />
            </section>


            {/* Right Sidebar */}
            <div className={`offcanvas offcanvas-end ${showRightSidebar ? 'show' : ''}`} tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasRightLabel">Menu</h5>
                    <button type="button" className="btn-close" onClick={toggleRightSidebar} aria-label="Close"></button>
                </div>
                <div className="offcanvas-body d-flex flex-column">
                    {/* Sidebar content */}
                    {/* Show Savings */}
                    <button className="btn btn-success w-100 mb-2" onClick={gotoSavings}>Show Savings</button>
                    {/* Show Budgets */}
                    <button className="btn btn-primary w-100 mb-2" onClick={gotobudget}>Show Budgets</button>
                    {/* Expenses */}
                    <button className="btn btn-warning w-100 mb-2" onClick={gotoExpense}>Expenses</button>
                    {/* Logout */}
                    <button className="btn btn-dark w-100 mt-auto" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div className="d-flex flex-column align-items-center justify-content-center" id="body">
                <Card bg='info' className='my-4' style={{ width: '23rem', borderRadius: '12px' }}>
                    {budgets && budgets[selectedIndex] ? (
                        <>
                            <div className="d-flex justify-content-between p-2">
                                <p className="display-7 fw-bold">Balance</p>
                                <p className="small">Active Wallet</p>
                            </div>

                            <div className="p-2">
                                <p className="display-6 text-center">
                                    <b>{progressValue ? progressValue : "0"}%</b>
                                </p>
                                <ProgressBar animated variant='success' now={progressValue} />
                            </div>
                            <p className='text-center mt-1'>
                                <small>You have a remaining budget of</small>
                            </p>
                            <p className="display-3 text-center">
                                <b>
                                    {budgets[selectedIndex].remaining_budget
                                        ? formatNumberToPHP(budgets[selectedIndex].remaining_budget)
                                        : "0"}
                                </b>
                            </p>
                            {spent > budgets[selectedIndex].budget_amount && (
                                <p className="text-center text-danger">You are over budget!</p>
                            )}

                            <div className="d-flex text-center mb-2 mx-2">
                                <div className="flex-fill border border-end-1 rounded-start-3 bg-light border-dark">
                                    <p className="text-center">
                                        <small>Budget</small>
                                        <br />
                                        <b>
                                            {budgets[selectedIndex].budget_amount
                                                ? formatNumberToPHP(budgets[selectedIndex].budget_amount)
                                                : "0"}
                                        </b>
                                    </p>
                                </div>
                                <div className="flex-fill border border-start-1 rounded-end-3 bg-light border-dark">
                                    <p className="text-center">
                                        <small>Expense</small>
                                        <br />
                                        <b>{formatNumberToPHP(spent)}</b>
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="p-4 text-center">
                            <p className="display-6">Add a budget!</p>
                            <button className="btn btn-outline-light w-100 mb-2" onClick={gotobudget}>Let's Go!</button>
                        </div>
                    )}
                </Card>




                {/* Dropdown using react-bootstrap */}
                {hasData && (
                    <Dropdown onSelect={(eventKey) => {
                        setSelectedIndex(eventKey);
                        localStorage.setItem('selectedIndex', eventKey);
                        setExpenseForm(false);
                    }} className="my-4 mt-1" style={{ width: '23rem' }}>
                        <Dropdown.Toggle variant="info" id="dropdown-basic" style={{ width: '100%' }}>
                            {budgets[selectedIndex]?.budget_name || 'Select Budget'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ width: '100%', minWidth: '23rem' }}>
                            {budgets.map((budget, index) => 
                             {
                               return(
                                <>
                                    <Dropdown.Item
                                        key={`${budget.budget_id}-${index}`}
                                        eventKey={index}
                                        className='text-center'
                                    >
                                        {budget.budget_name}
                                    </Dropdown.Item>
                                </>
                               )
                        })}
                        </Dropdown.Menu>
                    </Dropdown>
                )}
                {hasData && <button className="btn btn-primary mx-2 " style={{ width: '23rem' }} onClick={toggleExpenseModal} >Add Expense</button>}
            </div>

            {/* Expenses list as a table */}
            {hasExpense > 0 && (
                <div className="d-flex justify-content-center">
                    <table className="table table-striped" style={{ maxWidth: '23rem' }}>
                        <thead>
                            <tr className='border-bottom border-dark'>
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
                                    <tr key={index} className='border-bottom border-secondary'>
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
            )}

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
                                    className="form-control bg-info bg-opacity-10 border border-secondary"
                                    id="expenseName"
                                    onChange={(e) => setExpenseName(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="expenseAmount " className="form-label">Expense Amount</label>
                                <input
                                    type="number"
                                    className="form-control bg-info bg-opacity-10 border border-secondary"
                                    id="expenseAmount"
                                    value={expenseAmount}
                                    onChange={(e) => setExpenseAmount(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="expenseCategory" className="form-label">Expense Category</label>
                                <select
                                    className="form-select bg-info bg-opacity-10 border border-secondary"
                                    id="expenseCategory"
                                    value={expenseCategory}
                                    onChange={(e) => setExpenseCategory(e.target.value)}
                                >
                                    <option value="Others">Others</option>
                                    <option value="Food">Food</option>
                                    <option value="Transportation">Transportation</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Bills">Bills</option>
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
                        <Modal show={true} key={index} centered>
                            <Modal.Header>
                                <Modal.Title>Your budget date has finished, add remaining money to savings?</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p>Your budget {budget.budget_name} has expired.</p>
                                <p>Remaining budget: {budget.remaining_budget}</p>

                            </Modal.Body>
                            <Modal.Footer>
                                {budget.remaining_budget > 0 && (
                                    <>
                                        {hasSavings > 0 && (
                                        <>
                                        <Button variant="primary" onClick={() => {
                                            setAddToSavings(true);
                                            setReadRemain(budget.remaining_budget);
                                            setReadBudgetId(id)
                                        }} >
                                            Add to Savings
                                        </Button>
                                        </>
                                        )}
                                        <Button variant="primary" onClick={() => {
                                            setReadRemain(budget.remaining_budget);
                                            setAddToBudget(true);
                                            setReadBudgetId(id)
                                        }} >
                                            Add to new Budget
                                        </Button>

                                        <Button variant="secondary" onClick={() => deleteBudget(id)}>
                                            Keep
                                        </Button>
                                        </>
                                    )}
                                    
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

            {addToSavings && (
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
            {addToBudget && (
                <Modal show={true} backdrop={false} centered>
                    <Modal.Header>
                        <Modal.Title>Add to Budget</Modal.Title>
                    </Modal.Header>
                    
                    <form onSubmit={addToBudgetRem}>
                    <Modal.Body>
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
                    defaultValue={readRemain}
                    onChange={(e) => setReadRemain(e.target.value)}
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
                      let end = new Date();
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
                      let end = new Date();
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
                  {calendar && (
                    <input
                      type="date"
                      className="form-control form-control-lg mt-2"
                      onChange={(e) => {
                        setEndDate(e.target.value);
                      }}
                    />
                  )}
                  {error && <p className="text-danger">{error}</p>}
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="primary" type="submit">
                            Add to Budget
                        </Button>
                        <Button variant="secondary" onClick={() => setAddToBudget(false)}>
                            Close
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
                <Modal.Header>
                    <Modal.Title>Welcome to Tigum Pinas</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <em>
                        Take Control of Your Finances with Budget Genius.
                        <br /><br />
                        Stay on top of your finances and achieve your financial goals.
                        <br /><br />
                        Secure your financial future and take charge of your money.
                        <br /><br />
                        Eliminate financial stress and never overspend again.
                    </em>
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