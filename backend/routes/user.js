const path = require('path');

const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.post('/signup', userController.postUserSignup);

module.exports = router;