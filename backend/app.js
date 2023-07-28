const path = require('path');

const express = require('express');

require('dotenv').config();

const bodyParser = require('body-parser');

const error = require('./controllers/error');

const sequelize = require('./util/database');

var cors = require('cors');

const app = express();

app.use(cors());

const userSignup = require('./routes/user');   
const expense = require('./routes/expense');
const Expense = require('./models/expense');
const User = require('./models/user');

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded()) // to handle forms
// app.use(express.json()); // to handle forms

app.use('/user', userSignup);

app.use('/expense', expense);

User.hasMany(Expense);
Expense.belongsTo(User);

app.use(error.get404);

sequelize.sync()
.then(result => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
})

