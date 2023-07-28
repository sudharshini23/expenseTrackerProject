const Expense = require('../models/expense');

const getexpense = async (req,res,next) => {
    await Expense.findAll()
    .then(expenses => {
        res.status(200).json({expenses: expenses});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    })
} 

const addexpense = async (req,res,next) => {
    console.log(req.body);
    const expenseamount = req.body.expenseamount;
    const description = req.body.description;
    const category = req.body.category;
    await Expense.create({
        expenseamount: expenseamount,
        description: description,
        category: category
    })
    .then(result => {
        res.status(201).json({expenses: result})
    })
    .catch(err => {
        res.status(500).json({error: err})
    })
}

const deleteexpense = async (req,res,next) => {
    const expenseId = req.params.id;
    await Expense.findByPk(expenseId)
    .then(expense => {
        return expense.destroy();
    })
    .then(result => {
        res.status(200);
    })
    .catch(err => {
        res.status(500).json({error: err})
    })
}

module.exports = {
    getexpense,
    addexpense,
    deleteexpense
}