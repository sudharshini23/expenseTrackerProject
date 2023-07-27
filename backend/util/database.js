const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense', 'root', 'LearnSQL@#23', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;