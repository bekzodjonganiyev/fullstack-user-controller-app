const mysql = require("mysql")

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"password",
    database:"test"
})
db.connect()

module.exports = db