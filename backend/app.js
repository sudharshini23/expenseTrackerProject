const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const error = require('./controllers/error');

const sequelize = require('./util/database');

var cors = require('cors');

const app = express();

app.use(cors());

const userSignup = require('./routes/user');   

app.use(bodyParser.json());

app.use('/user', userSignup);

app.use(error.get404);

sequelize.sync()
.then(result => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
})

