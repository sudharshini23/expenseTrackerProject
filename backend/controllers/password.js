// const { response } = require('express');
const Sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const forgotpasswordmodel = require('../models/password');
const User = require('../models/user');

const dotenv = require('dotenv').config();

const forgotpassword = async(req,res,next) => {
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.API_KEY;
    try {
        const email = req.body.email;
        const user = await User.findAll({where : {email: email}});
        if(user) {
            const id = uuid.v4();
            console.log(id);
            const forgotpasswordcreate = await forgotpasswordmodel
            .create({ id, active: true, userId: user[0].id })
            const tranEmailApi = new Sib.TransactionalEmailsApi()
            const sender = {
                // email: 'tarunbhadoriya141@gmail.com'
                email: process.env.EMAIL,
            }
            console.log(sender);
            console.log(process.env.API_KEY);
            const receivers = [
                {
                    email: req.body.email,
                },
            ]
            const msg = {
                    sender,
                    to: receivers,
                    subject: 'Forgot Password Testing',
                    htmlContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password </a>`,
                }
            try {
                const sentEmail = await tranEmailApi.sendTransacEmail(msg);
                return res.status(200).json({message: 'Link to reset password sent to your mail', success: true});
            }
            catch(err) {
                console.log(JSON.stringify(err))
                throw new Error(err);
            }
        }
        else {
            throw new Error('User does not Exist');
        }
    }
    catch(err) {
        console.log(JSON.stringify(err))
        return res.status(405).json({message : "Failed", success : false})
    }
}

const resetpassword = async (req,res,next) => {
    const id = req.params.id;
    // try {
    const forgotPasswordReq = await forgotpasswordmodel.findOne({ where: { id } });
        if(forgotPasswordReq) {
            await forgotPasswordReq.update({ active: false });
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e) {
                                            e.preventDefault();
                                            console.log("called")
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                    </html>`
            )
            res.end();
           // }
            // else {
            //     res.status(404).json({ message: 'Password reset request not found' });
            // }
        // } catch (err) {
        //     console.error(JSON.stringify(err));
        //     res.status(500).json({ message: 'Failed to reset password', error: err });
        }
    };
    

const updatepassword = async(req,res,next) => {
    try {
        const {newpassword} = req.query;
        const {resetpasswordid} = req.params;
        forgotpasswordmodel.findOne({where: {id: resetpasswordid }})
        .then(resetpasswordreq => {
            console.log(resetpasswordreq);
            User.findOne({where: { id : resetpasswordreq.userId}})
            .then(user => {
                console.log(user);
                if(user) {
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err) {
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfully update the new password'})
                            })
                        })
                    })
                }
                else {
                    return res.status(404).json({ error: 'No user Exists', success: false})
                }
            })
        })
    }
    catch(err) {
        return res.status(403).json({ err, success: false } )
    }
}

module.exports = {
    forgotpassword,
    resetpassword,
    updatepassword
}