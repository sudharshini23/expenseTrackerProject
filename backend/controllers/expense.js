const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');

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
    // console.log(req.body);
    const t = await sequelize.transaction();

try {
    console.log(req.body);
    const expenseamount = req.body.expenseamount;
    const description = req.body.description;
    const category = req.body.category;
    console.log(req.user.id);
    const expense = await Expense.create({
        expenseamount: expenseamount,
        description: description,
        category: category,
        userId: req.user.id
    },
    {
        transaction: t
    })
    const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount)
    console.log(totalExpense)
    await User.update({
        totalExpenses: totalExpense
    }, {
        where: {id: req.user.id},
        transaction: t
    })
    await t.commit();
    res.status(201).json({expenses: expense})
}
    catch(err) {
        await t.rollback();
        res.status(500).json({error: err})
    }
}

const deleteexpense = async (req,res,next) => {
    const t = await sequelize.transaction();
    try {
    // const expenseamount = req.body.expenseamount;
    const expenseId = req.params.id;
    const expense = await Expense.findByPk(expenseId)
    const delexpamt = expense.expenseamount;
    const result = await expense.destroy({where: { id: expenseId, userId: req.user.id}, transaction: t});
        // if(result === 0) {
        //     await t.rollback();
        //     return res.status(404).json({success: false, message: 'Expense doesnt belong to the user'})
        // }
        console.log(req.user.totalExpenses)
        const newtotalExpense = Number(req.user.totalExpenses) - Number(delexpamt)
        console.log(newtotalExpense);
        await User.update({
            totalExpenses: newtotalExpense
        }, {
            where: {id: req.user.id},
            transaction: t
        })
            await t.commit();
            res.status(200).json({success: true, message: 'Deleted Successfully'})
    }
    catch(err) {
        await t.rollback();
        res.status(500).json({error: err})
    }
}

module.exports = {
    getexpense,
    addexpense,
    deleteexpense
}