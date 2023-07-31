const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');
const AWS = require('aws-sdk');

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

const getexpenses = async (req,res,next) => {
    try {
        let page =+ req.query.page || 1;
        const pageSize =+ req.query.pagesize || 3;
        const totalexpense = await Expense.count({where: {userId: req.user.id}});
        console.log(totalexpense);
        console.log('userId is: ', req.user.id);
        const expense = await Expense.findAll({where: {userId: req.user.id}, 
        offset: (page - 1) * pageSize,
        limit: pageSize
        })
        res.status(200).json({
            allExpenses: expense,
            currentPage : page,
            hasNextPage : page *pageSize < totalexpense,
            nextPage : page +1,
            hasPreviousPage : page >1,
            previousPage : page -1,
            lastPage : Math.ceil(totalexpense/pageSize)
        }) 
    }
    catch(err){
        return res.status(401).json({success: false});
    }
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

function uploadToS3(data, filename) {
    const BUCKET_NAME = 'expensetrackernew';
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3( {
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    })

        var params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL: 'public-read'
        }

        return new Promise((resolve, reject) => {
            s3bucket.upload(params, (err, s3response) => {
                if(err) {
                    console.log('Something went wrong');
                    reject(err);
                }
                else {
                    // console.log('Successful', s3response);
                    resolve(s3response.Location);
                }
            })
        })

}

const downloadexpense = async(req,res,next) => {
    try {
        const expenses = await req.user.getExpenses();
        console.log(expenses);
        const stringifiedExpenses = JSON.stringify(expenses);

        const userId = req.user.id;

        const fileName = `Expense${userId}/${new Date()}.txt`;
        const fileURl = await uploadToS3(stringifiedExpenses, fileName);
        console.log(fileURl);
        res.status(200).json({ fileURl, success: true});
    }
    catch(err) {
        console.log(err);
        res.status(500).json({fileURl: '', success: false, err: err})
    }
}

module.exports = {
    getexpense,
    addexpense,
    deleteexpense,
    downloadexpense,
    getexpenses
}