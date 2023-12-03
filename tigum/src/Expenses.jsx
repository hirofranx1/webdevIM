import { useState, useContext, useEffect } from 'react';
import { UserContext } from "./UserContext";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { BsThreeDots } from "react-icons/bs";
import Card from 'react-bootstrap/Card';
import { CardBody, CardHeader } from 'react-bootstrap';

function Expenses() {

    const { user, setUser } = useContext(UserContext);
    const id = user.user_id;
    console.log(id, "id");
    const history = useNavigate();

    const goback = () => {
        history('/dashboard');
    }

    const [expense, setExpense] = useState([{}]);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            console.log(id, "id");
            axios.get(`http://localhost:5000/getallexpenses/${id}`)
                .then((response) => {
                    setExpense(response.data.result);
                    console.log(response.data);
                }).catch((error) => {
                    console.log(error.response.data);
                })
        }
    }, [id])

    useEffect(() => {
        function checkUser() {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                console.log(user, "in");
                setUser(JSON.parse(storedUser));
                return;
            }
            else {
                history('/');
            }
        }
        checkUser();
    }, [])


    return (
        <>
            <Card className='bg-info m-4'>

                <CardHeader>
                    <button type="button" className="btn-close" aria-label="Close" onClick={goback}></button>
                    <h1 className='d-flex justify-content-center'>Expenses</h1>
                </CardHeader>

                <CardBody>
                    {expense.map((expense, index) => {
                        const utcDate = new Date(expense.expense_time);
                        const LocalDate = utcDate.toLocaleDateString();
                        const ComDate = utcDate.toLocaleString();

                        return (
                            <div key={index} className='border-bottom border-bottom-dark'>
                                {/*pls turn this into a kana ganing murag three dots? na vertical? basta button siya na ig ka pindut kay ipakita tanan details*/}

                                <br />
                                <div className="d-flex flex-row justify-content-between">
                                    <h4>{expense.expense_name}</h4>
                                    <p>Expense Amount: {expense.expense_amount}</p>
                                </div>
                                <div className="d-flex flex-row justify-content-between">
                                    <div>
                                        <p>Date: {LocalDate}</p>
                                        <p>From Budget: {expense.budget_name}</p>
                                    </div>
                                    <div>
                                        <BsThreeDots onClick={() => setModalOpen(true)} />
                                    </div>
                                </div>
                                <br />
                                {modalOpen &&
                                    (
                                        <Modal show={true} backdrop={false} centered>
                                            <Modal.Body><div className="d-flex flex-row justify-content-between">
                                                <h4>{expense.expense_name}</h4>
                                                <p>Expense Amount: {expense.expense_amount}</p>
                                            </div>
                                                <p>Date: {ComDate}</p>
                                                <p>From Budget: {expense.budget_name}</p>
                                                <br />
                                                <p>Expense Category: {expense.expenseCategory}</p>
                                                <button>Update</button>
                                                <button>Delete</button>
                                                <button onClick={() => setModalOpen(false)}>Close</button>
                                            </Modal.Body>
                                        </Modal>
                                    )
                                }
                            </div>
                        )
                    })}
                </CardBody>

            </Card>
        </>
    )
}

export default Expenses