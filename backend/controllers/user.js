const User = require('../models/user');

const postUserSignup = async (req,res,next) => {
    try {
        if(!req.body.email) {
            throw new Error('Email is mandatory')
        }
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const newUser = await User.create({
            name: name,
            email: email,
            password: password
        })

        res.status(201).redirect('/login/login.html')
    }
    catch(err) {
        res.status(500).json({error: err});
    }
}

module.exports = {
    postUserSignup
}