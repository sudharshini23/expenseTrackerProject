const User = require('../models/user');

// function isStringInvalid(string) {
//     if(string == undefined || string.length === 0) {
//         return true;
//     }
//     else {
//         return false;
//     }
// }

const postUserSignup = async (req,res,next) => {
    // if(!req.body.email) {
    //     throw new Error('Email is mandatory')
    // }
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        if(name == undefined || name.length === 0 
            || password == undefined || password.length === 0
            || email == undefined || email.length === 0) 
        {
            return res.status(400).json({ err : "Field should not be empty"})
        }

        const newUser = await User.create({
            name: name,
            email: email,
            password: password
        })
        
        res.status(201).json({message: 'Successfully created new user'})
    }
    
    catch(err) {
        res.status(500).json(err)
    }
        // res.status(201).redirect('/login/login.html')
}

module.exports = {
    postUserSignup
}