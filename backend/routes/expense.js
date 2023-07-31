const path = require('path');

const express = require('express');

const expenseController = require('../controllers/expense');

const userauthentication = require('../middleware/auth');

const router = express.Router();

router.post('/addexpense', userauthentication.authenticate, expenseController.addexpense);

router.get('/getexpense', userauthentication.authenticate , expenseController.getexpense);

router.delete('/deleteexpense/:id', userauthentication.authenticate, expenseController.deleteexpense);

router.get('/getpageexpenses', userauthentication.authenticate ,expenseController.getexpenses);

// router.get('/download', authenticationmiddleware.authenticate, expenseController.downloadexpense);

module.exports = router;