const Expense = require('../models/expense');
const User = require('../models/user');

const getexpense = async (req,res,next) => {
    
    await Expense.findAll({ where: {userId: req.user.id}})
    .then(expenses => {
        console.log(req.user);
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
    Expense.create({
        expenseamount: expenseamount,
        description: description,
        category: category,
        userId: req.user.id
    })
    .then(result => {
        const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount)
        console.log(totalExpense)
        User.update({
            totalExpenses: totalExpense
        }, {
            where: {id: req.user.id}
        }).then(async() => {
            res.status(201).json({expenses: result})
        })
        .catch(async(err) => {
            return res.status(500).json({success: false, error: err})
        })
    })
    .catch(err => {
        res.status(500).json({error: err})
    })
}

const deleteexpense = async (req,res,next) => {
    const expenseId = req.params.id;
    await Expense.findByPk(expenseId)
    .then(expense => {
        return expense.destroy({where: { id: expenseId, userId: req.user.id}});
    })
    .then(result => {
        if(result === 0) {
            return res.status(404).json({success: false, message: 'Expense doesnt belong to the user'})
        }
        else {
            res.status(200).json({success: true, message: 'Deleted Successfully'})
        }
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