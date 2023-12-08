import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import 'react-calendar/dist/Calendar.css';
import { BsThreeDots } from "react-icons/bs";
import ProgressBar from 'react-bootstrap/ProgressBar';

function Savings() {

    const { user, setUser } = useContext(UserContext);
    const [savings, setSavings] = useState([{}]);
    const [readSave, setReadSave] = useState({});
    const [showEditForm, setShowEditForm] = useState(false);
    const [savingsAmount, setSavingsAmount] = useState(0);
    const [savingsName, setSavingsName] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [showDeleteForm, setShowDeleteForm] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [moneyAmount, setMoneyAmount] = useState(0);
    const [savingsId, setSavingsId] = useState(0);
    const [addMoneyForm, setAddMoneyForm] = useState(false);
    const [deleteMoneyForm, setDeleteMoneyForm] = useState(false);
    const [getAdds, setGetAdds] = useState([{}]);
    const [deleteAddAmount, setDeleteAddAmount] = useState(0);
    const [deleteAddId, setDeleteAddId] = useState(0);
    const [subtractMoneyForm, setSubtractMoneyForm] = useState(false);
    const [savingsGoal, setSavingsGoal] = useState(0);
    const [savingsDate, setSavingsDate] = useState(new Date());
    const [error, setError] = useState("");


    const id = user.user_id;
    const history = useNavigate();
    const back = () => {
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
        axios.get(`http://localhost:5000/getsavings/${id}`)
            .then((response) => {
                setSavings(response.data.result);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [id]);

    async function addSavings(e) {
        e.preventDefault();
        if (savingsAmount < 0) {
            return setError("Starting Amount must be 0 or greater than 0");
        }
        if (savingsGoal < 0) {
            return setError("Goal Amount cannot be negative");
        }
        if (new Date(savingsDate) < new Date()) {
            return setError("Goal Date cannot be in the past");
        }
        try {
            const savingsData = {
                savings_name: savingsName,
                savings_amount: savingsAmount,
                user_id: id,
                savings_goal: savingsGoal,
                savings_date: savingsDate
            }
            await axios.post("http://localhost:5000/addsavings", savingsData);
            setShowAddForm(false);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    async function deleteSavings() {
        const id = readSave.savings_id;
        axios.put(`http://localhost:5000/deletesavings/${id}`)
            .then((response) => {
                console.log(response);
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            }
            );
    }

    async function addMoney(e) {
        e.preventDefault();
        const id = readSave.savings_id;
        if (moneyAmount <= 0) {
            return setError("Amount must be greater than 0");
        }

        axios.post(`http://localhost:5000/addmoney`, { id, savings_amount: moneyAmount })
            .then((response) => {
                console.log(response);
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            }
            );
    }

    async function subtractMoney(e) {
        e.preventDefault();
        const id = readSave.savings_id;
        if (moneyAmount <= 0) {
            return setError("Amount must be greater than 0");
        }
        axios.post(`http://localhost:5000/subtractmoney`, { id, savings_amount: moneyAmount })
            .then((response) => {
                console.log(response);
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            }
            );
    }
    async function EditSavings(e) {
        e.preventDefault();
        const id = readSave.savings_id;
        if (savingsGoal < 0) {
            return setError("Goal Amount cannot be negative");
        }
        if (new Date(savingsDate) < new Date()) {
            return setError("Goal Date cannot be in the past");
        }

        const savingsData = {
            savings_name: savingsName,
            savings_goal: savingsGoal,
            savings_goal_date: savingsDate
        }
        axios.put(`http://localhost:5000/editsavings/${id}`, savingsData)
            .then((response) => {
                console.log(response);
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            }
            );
    }

    useEffect(() => {
        const id = readSave.savings_id;
        axios.get(`http://localhost:5000/getadds/${id}`)
            .then((response) => {
                setGetAdds(response.data.result);
            })
            .catch((err) => {
                console.log(err);
            });
    })


    async function deleteMoney() {
        const id = deleteAddId;
        const amount = deleteAddAmount;
        const savings_id = readSave.savings_id;
        console.log(amount);
        axios.put(`http://localhost:5000/deleteaddsavings`, { id, amount, savings_id })
            .then((response) => {
                console.log(response)
                window.location.reload();
            })
            .catch((err) => {
                console.log(err.message);
            }
            );
    }

    return (
        <>

            {/* kani i edit stella */}

            <div>
                <button onClick={back} className="btn btn-secondary m-3">Back</button>

                <div className="container-fluid rounded-4 mb-4">
                    <div className="container px-0">
                        <nav className="navbar bg-info bg-opacity-10 border border-info rounded-4 d-flex justify-content-center align-items-center m-0 px-3 flex-column">
                            <p className="display-6 mb-0 text-dark">Savings</p>
                            <button onClick={() => setShowAddForm(true)} className="btn btn-primary w-100 mt-3">Add Savings</button>
                        </nav>
                    </div>
                </div>
            </div>





            {/* ari kutob */}

            {/* card thingy */}
            <div className="row row-cols-1 row-cols-md-2 g-4 p-3">
                {savings.map((val, key) => {
                    let progressValue = Math.round((val.savings_amount / val.savings_goal) * 100);
                    if (progressValue > 100) {
                        progressValue = 100;
                    }

                    const accumulatedAmountPHP = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(val.savings_amount);
                    const goalAmountPHP = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(val.savings_goal);

                    return (
                        <div key={key} className="col">
                            <div className="card position-relative">
                                <div className="card-body">
                                    <h2 className="card-title">{val.savings_name}</h2>
                                    <div className="mb-3">
                                        <p>Accumulated Amount</p>
                                        <h2>{accumulatedAmountPHP}</h2>
                                        <div className="p-2">
                                            <p className="display-6 text-center"><b>{progressValue || "0"}%</b></p>
                                            <ProgressBar animated variant='success' now={progressValue} />
                                            {progressValue === 100 && <p className="text-center">Goal Reached!</p>}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <p>Goal Amount</p>
                                        <h2>{goalAmountPHP}</h2>
                                    </div>
                                    <div className="mb-3">
                                        <p>Goal Date</p>
                                        <h2>{new Date(val.savings_goal_date).toLocaleDateString()}</h2>
                                    </div>
                                    <div className="position-absolute top-0 end-0">
                                        <button onClick={() => { setShowDetails(true); setReadSave(val) }} className="btn">
                                            <BsThreeDots size={50} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )

                })}
            </div>




            {showAddForm && (
                <Modal show={true} backdrop={false}>
                    <Modal.Header>Add Savings</Modal.Header>
                    <form onSubmit={addSavings}>
                        <Modal.Body>
                            <label>
                                Savings Name
                            </label>
                            <br />
                            <input type="text" onChange={(e) => setSavingsName(e.target.value)} required className="form-control" placeholder="Savings Name" />
                            <br />
                            <label>
                                Starting Amount
                            </label>
                            <br />
                            <input type="number" onChange={(e) => setSavingsAmount(e.target.value)} required className="form-control" placeholder="Savings Amount" />
                            <br />
                            <label>
                                Goal Amount
                            </label>
                            <br />
                            <input type="number" onChange={(e) => setSavingsGoal(e.target.value)} required className="form-control" placeholder="Savings Goal" />
                            <br />
                            <label>
                                Goal Date
                            </label>
                            <br />
                            <input type="date" onChange={(e) => setSavingsDate(e.target.value)} className="form-control" placeholder="Savings Date" />
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </Modal.Body>
                        <Modal.Footer>
                            <input type="submit" className="btn btn-primary" value="Add Savings" />
                            <button onClick={() => setShowAddForm(false)} className="btn btn-secondary"> Cancel </button>
                        </Modal.Footer>
                    </form>


                </Modal>
            )}

            {showDetails && (
                <Modal show={true} backdrop={false}>
                    <Modal.Header>{readSave.savings_name}
                        <button onClick={() => { setAddMoneyForm(true); setSavingsId(readSave.savings_id) }} className="btn btn-primary"> Add Money </button>
                        <button onClick={() => { setSubtractMoneyForm(true); setSavingsId(readSave.savings_id) }} className="btn btn-primary"> Subtract Money </button>
                    </Modal.Header>
                    <Modal.Body>
                        <p> Accumulated Amount: {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(readSave.savings_amount)} </p>
                        <p> Starting Amount: {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(readSave.savings_started)}</p>
                        <p> Started: {new Date(readSave.savings_date).toLocaleDateString()} </p>
                        <p> Goal Date: {new Date(readSave.savings_goal_date).toLocaleDateString()} </p>

                        <div>
                            {getAdds.length > 0 && <h1 className="border-bottom border-dark"> Activity </h1>}
                            <div className="scrollpsy-table" style={{ maxHeight: "300px", overflowY: "auto" }}>
                                {getAdds.map((val, key) => {
                                    return (
                                        <div key={key} className="d-flex justify-content-between align-items-center">
                                            <div>
                                                {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(val.savings_add_amount)}
                                            </div>
                                            <div>
                                                {new Date(val.savings_add_date).toLocaleDateString()}
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <button onClick={() => {
                                                    setDeleteMoneyForm(true);
                                                    setDeleteAddAmount(val.savings_add_amount);
                                                    setDeleteAddId(val.savings_add_id);
                                                }} className="btn">
                                                    <BsThreeDots />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={() => {
                            setShowEditForm(true);
                            setSavingsName(readSave.savings_name);
                            setSavingsGoal(readSave.savings_goal);
                            setSavingsDate(readSave.savings_goal_date);
                        }} className="btn btn-primary"> Edit </button>
                        <button onClick={() => setShowDeleteForm(true)} className="btn btn-danger"> Delete </button>
                        <button onClick={() => setShowDetails(false)} className="btn btn-secondary"> Cancel </button>
                    </Modal.Footer>
                </Modal>
            )}


            {showEditForm && (
                <Modal show={true} backdrop={false}>
                    <Modal.Header>Edit Savings</Modal.Header>
                    <form onSubmit={EditSavings}>
                        <Modal.Body>
                            <label>
                                Savings Name
                            </label>
                            <br />
                            <input type="text" onChange={(e) => setSavingsName(e.target.value)} className="form-control" placeholder={savingsName} />
                            <br />
                            <label>
                                Goal Amount
                            </label>
                            <br />
                            <input type="number" onChange={(e) => setSavingsGoal(e.target.value)} className="form-control" placeholder={savingsGoal} />
                            <br />
                            <label>
                                Goal Date: (Current: {new Date(savingsDate).toLocaleDateString()})
                            </label>
                            <br />
                            <input type="date" onChange={(e) => setSavingsDate(e.target.value)} className="form-control" placeholder="Savings Date" />
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </Modal.Body>
                        <Modal.Footer>
                            <input type="submit" className="btn btn-primary" value="Edit Savings" />
                            <button onClick={() => setShowEditForm(false)} className="btn btn-secondary"> Cancel </button>
                        </Modal.Footer>
                    </form>
                </Modal>
            )}

            {addMoneyForm && (
                <Modal show={true} backdrop={false}>
                    <Modal.Header>Add Money</Modal.Header>
                    <form onSubmit={addMoney}>
                        <Modal.Body>
                            <label>
                                Amount
                            </label>
                            <br />
                            <input type="number" onChange={(e) => setMoneyAmount(e.target.value)} className="form-control" placeholder="Amount" />
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </Modal.Body>
                        <Modal.Footer>
                            <input type="submit" className="btn btn-primary" value="Add Money" />
                            <button onClick={() => setAddMoneyForm(false)} className="btn btn-secondary"> Cancel </button>
                        </Modal.Footer>
                    </form>
                </Modal>
            )}

            {subtractMoneyForm && (
                <Modal show={true} backdrop={false}>
                    <Modal.Header>Subtract Money</Modal.Header>
                    <form onSubmit={subtractMoney}>
                        <Modal.Body>
                            <label>
                                Amount
                            </label>
                            <br />
                            <input type="number" onChange={(e) => setMoneyAmount(e.target.value)} className="form-control" placeholder="Amount" />
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </Modal.Body>
                        <Modal.Footer>
                            <input type="submit" className="btn btn-primary" value="Subtract Money" />
                            <button onClick={() => setSubtractMoneyForm(false)} className="btn btn-secondary"> Cancel </button>
                        </Modal.Footer>
                    </form>
                </Modal>
            )}




            {showDeleteForm && (
                <Modal show={true} backdrop={false}>
                    <Modal.Header>Delete Savings</Modal.Header>
                    <Modal.Body>
                        <p> Are you sure you want to delete {readSave.savings_name}?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={deleteSavings} className="btn btn-primary"> Delete </button>
                        <button onClick={() => setShowDeleteForm(false)} className="btn btn-secondary"> Cancel </button>

                    </Modal.Footer>
                </Modal>
            )}

            {deleteMoneyForm && (
                <Modal show={true} backdrop={false}>
                    <Modal.Header>Delete Money</Modal.Header>
                    <Modal.Body>
                        <p> Are you sure you want to delete this add from this savings?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={deleteMoney} className="btn btn-primary"> Delete </button>
                        <button onClick={() => setDeleteMoneyForm(false)} className="btn btn-secondary"> Cancel </button>

                    </Modal.Footer>
                </Modal>
            )}

        </>
    )
}

export default Savings