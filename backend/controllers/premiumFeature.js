const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/database');
const e = require('express');

const getUserLeaderBoard = async (req,res,next) => {
    try {

        const leaderboardofusers = await User.findAll({
            order: [['totalExpenses', 'DESC']]
        })
        // --- USING LEFT OUTER JOIN -----------------------------------
        // const leaderboardofusers = await User.findAll({
        //     attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.expenseamount')), 'total_cost'] ],
        //     include: [
        //         // can be join of more than 2 tables so array
        //         {
        //             model: Expense,
        //             attributes: []
        //         }
        //     ],
        //     group: ['id'],
        //     order: [['total_cost', 'DESC']]
            
        // });
        // ----------------------------------------------------------------
        // ---- USING JOINS ----------
        // console.log(users.id)
        // console.log(users.name)

        // const expenses = await Expense.findAll({
        //     attributes: ['userId', [sequelize.fn('sum', sequelize.col('expenses.expenseamount')), 'total_cost']],
        //     group: ['userID']
        // });

        // console.log(expenses.userId);
        // console.log(expenses.userID);
        // console.log(expenses.total_cost)
        
        // const userAggregatedExpenses = {}
        // Summing up expense amount by grouping by id:

        // --------------------------------------------------------------------------
        // expenses.forEach(expense => {
        //     if(userAggregatedExpenses[expense.userId]) {
        //         // console.log(expense.req.user.id);
        //         userAggregatedExpenses[expense.userId] = userAggregatedExpenses[expense.userId] + expense.expenseamount;
        //     }
        //     else {
        //         userAggregatedExpenses[expense.userId] = expense.expenseamount;
        //     }
        // })
        // ---------------------------------------------------------------------------
        // var userLeaderBoardDetails = [];
        // users.forEach(user => {
        //     console.log(user);
        //     userLeaderBoardDetails.push({ name: user.name, total_cost: userAggregatedExpenses[user.id] || 0})
        // })
        // console.log(userAggregatedExpenses);
        // // userLeaderBoardDetails is an array of object, cannot sort normally using sort method
        // userLeaderBoardDetails.sort((a, b) => b.total_cost - a.total_cost)
        res.status(200).json(leaderboardofusers)
    }
    catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

module.exports = {
    getUserLeaderBoard
}