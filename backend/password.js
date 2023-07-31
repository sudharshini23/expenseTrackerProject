// const { response } = require('express');
const Sib = require('sib-api-v3-sdk');

require('dotenv').config();

const client = Sib.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = process.env.API_KEY;


const tranEmailApi = new Sib.TransactionalEmailsApi()

const sender = {
    email: process.env.EMAIL
}
console.log(sender);

console.log(process.env.API_KEY);

const receivers = [
    {
        email: 'sudarsh25@gmail.com',
    },
]

tranEmailApi.sendTransacEmail({
    sender,
    to: receivers,
    subject: 'Forgot Password Testing',
    textContent: `Forgotten your password`
})
.then((response) => {
    console.log(response);
})
.catch((err) => {
    console.log(err);
})