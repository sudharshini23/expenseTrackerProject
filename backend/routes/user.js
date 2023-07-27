const path = require('path');

const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.post('/signup', userController.postUserSignup);

router.post('/login', userController.postUserLogin);

module.exports = router;