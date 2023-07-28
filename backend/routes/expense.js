const path = require('path');

const express = require('express');

const expenseController = require('../controllers/expense');

const router = express.Router();

router.post('/addexpense', expenseController.addexpense);

router.get('/getexpense', expenseController.getexpense);

router.delete('/deleteexpense/:id', expenseController.deleteexpense);

module.exports = router;