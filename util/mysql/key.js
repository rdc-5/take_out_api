const mysql = require('mysql')

const key = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'zy9211314.',
    database: 'take_out'
})

module.exports = key;