const mysql = require('mysql2/promise')
require('dotenv').config()

const connection = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DB,
    timezone:'Z',
    dateStrings:true
});
// console.log(connection)
module.exports = {connection}