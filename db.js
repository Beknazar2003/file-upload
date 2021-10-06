require('dotenv').config()
const {Sequelize} = require('sequelize')

module.exports = new Sequelize(
    process.env.DB_NAME, // Название БД
    process.env.DB_USER, // Пользователь
    process.env.DB_PASSWORD, // ПАРОЛЬ
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,//хост
        port: process.env.DB_PORT,//порт
        pool: {
            max: 5,
            min: 0,
            idle: 300000,
            acquire: 300000
          }
    }
)