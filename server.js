// for async error handling (no need to use try catch)
require('express-async-errors');

const express = require('express');
const logger = require('./config/logging');
const api = require('./api');
const dbConnect = require('./config/dbConnect');
require('dotenv').config();

const app = express();
logger();
dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;

app.use('/api', (req, res, next) => {
    // console.log('<<<< req.headers >>>>\n', req.headers);
    // console.log('<<<< req.params >>>>\n', req.params);
    // console.log('<<<< req.query >>>>\n', req.query);
    console.log('<<<< req.body >>>>\n', req.body);
    // console.log('<<<< req.files >>>>\n', req.files);
    // console.log('<<<< req.originalUrl >>>>\n', req.originalUrl);
    // console.log('<<<< req.body >>>>\n', req.body);
    next();
}, api);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));