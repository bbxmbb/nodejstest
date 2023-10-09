const express = require("express");
const app = express();
const port = 3000;
const mysql = require('mysql');
const ejs = require('ejs');
require('dotenv').config();

// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });
const databaseConfig = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
};
const connection = mysql.createConnection(databaseConfig);

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    connection.query('SELECT * FROM items', (err, rows) => {
        if (err) {
            console.error('Error executing query:', err);
            return;
        }
        // console.log(rows);
        res.render('index', {
            data: rows
        });
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});