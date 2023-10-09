const express = require("express");
const app = express();
const port = 3000;
// const mysql = require('mysql');
const mysql = require('mysql2/promise'); // Import mysql2
const cron = require('node-cron');
const http = require('http');

const ejs = require('ejs');
require('dotenv').config();


const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
app.get('/refresh', (req, res) => {
    console.log('Refreshing webpage');
    res.send('Webpage refreshed!');
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




// Define a function to send a request to keep the server alive
const keepServerAlive = () => {
    const options = {
        hostname: 'localhost', // Replace with your server URL
        port: 3000, // Use the appropriate port
        path: '/refresh', // The path you want to keep alive
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        console.log(`Response from server: ${res.statusCode}`);
    });

    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
    });

    req.end();
};
cron.schedule('* * * * *', () => {
    console.log('This will run every 1 minutes');
    keepServerAlive();
});