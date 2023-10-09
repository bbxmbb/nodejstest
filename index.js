const express = require("express");
const app = express();
const port = 3000;
// const mysql = require('mysql');
const mysql = require('mysql2/promise'); // Import mysql2
const cron = require('node-cron');


const ejs = require('ejs');
require('dotenv').config();

// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });
const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
cron.schedule('*/14 * * * *', () => {
    console.log('This will run every 14 minutes');
});
app.get('/', async (req, res) => {
    try {
        const [rows, fields] = await pool.execute('SELECT * FROM items'); // Use pool.execute() for queries
        // res.json(rows);
        console.log("somebody access this page")
        res.render('index', {
            data: rows
        });
    } catch (error) {
        console.error('Error executing MySQL query:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.set('view engine', 'ejs');

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});