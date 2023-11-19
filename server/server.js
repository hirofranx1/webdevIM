const express = require('express');
const app = express();
const port = 5000; 
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

app.use(cors({
  origin: ['http://localhost:5173']
}));

app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: "",
  database: "tigum_data"
});

db.connect((error) => {
  if(error) {
    console.log("Error connecting to database");
  } else {
    console.log("Connected");
  }
});

app.post('/register', (req, res) => {
  const {firstname, lastname, email, password} = req.body;
  console.log(firstname, lastname, email, password);
  const emailSearch = `SELECT * FROM users WHERE email = ?`;
  let emailTaken = false;
    db.query(emailSearch, [email], (error, result) => {
        if(result.length>0){
          emailTaken = true;
          console.log(lastname);
          return res.status(401).json({message: "Email Taken"});
        }
        if(!emailTaken) {
            const sql = `INSERT INTO users(firstname, lastname, email, password_hash) VALUES (?, ?, ?, ?)`;
            console.log("hello");
            db.query(sql, [firstname, lastname, email, password], (error, result) => {
              console.log("Success");
              if(error){
                console.log(error);
              }
              if(result){
                console.log(result);
                return res.json({result:result});
              }
          })
      }
    })
});

console.log("Welcome");

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const sql = `SELECT * FROM users WHERE email = ?`;
  // const sql = `SELECT Users.*, Budgets.*
  // FROM users 
  // LEFT JOIN budgets ON users.user_id = budgets.user_id
  // WHERE email = ?`;
        //   `
        // SELECT Users.*, Income.*, Expense_Categories.*, Expenses.*, Transactions.*, Budgets.*, Goals.*, Reminders.*, Wallets.*
        // FROM Users
        // LEFT JOIN Income ON Users.user_id = Income.user_id
        // LEFT JOIN Expense_Categories ON Users.user_id = Expense_Categories.user_id
        // LEFT JOIN Expenses ON Users.user_id = Expenses.user_id
        // LEFT JOIN Transactions ON Users.user_id = Transactions.user_id
        // LEFT JOIN Budgets ON Users.user_id = Budgets.user_id
        // LEFT JOIN Goals ON Users.user_id = Goals.user_id
        // LEFT JOIN Reminders ON Users.user_id = Reminders.user_id
        // LEFT JOIN Wallets ON Users.user_id = Wallets.user_id
        // WHERE Users.email = ?
        // `
  db.query(sql, [email], (error, result) => {
    if(error){
      console.log(error);
    }
    if(result && result.length > 0){
      const user = result[0];
      if(user.password_hash === password){
        console.log(user);
        return res.json({user:user});
      } else {
        return res.status(401).json({message: "Wrong Password"});
      }
    }
  })
});

app.get('/users', (req, res) => {
  console.log("What");
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});