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
          return res.status(401).json({message: "Email Taken"});
        }
        if(!emailTaken) {
            const sql = `INSERT INTO users(firstname, lastname, email, password) VALUES (?, ?, ?, ?)`;
            
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

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const sql = `SELECT * FROM users WHERE email = ?`;
  db.query(sql, [email], (error, result) => {
    if(error){
      console.log(error);
      return res.status(401).json({message: "Email not found"});
    }
    if(result && result.length > 0){
      const user = result[0];
        if(user.password === password){
          console.log(user);
          return res.json({user:user});
        } else {
          return res.status(401).json({message: "Wrong Password"});
        }
    } else {
      return res.status(401).json({message: "There is an error while logging in"});
    }
  })
});

app.post('/addbudget', (req, res) => {
    console.log("hello");
});


app.get('/users', (req, res) => {
  console.log("What");
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});