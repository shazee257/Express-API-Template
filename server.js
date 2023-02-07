// for async error handling (no need to use try catch)
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const logger = require('./config/logging');
const api = require('./api');
const dbConnect = require('./config/dbConnect');
const cookieSession = require('cookie-session');
require('dotenv').config();

const app = express();
logger();
dbConnect();

app.use(cookieSession({
    name: 'session',
    keys: ['COOKIE_KEY'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;

app.use('/api', (req, res, next) => {
    console.log('<<<< req.session >>>>\n', req.session);
    // console.log('<<<< req.headers >>>>\n', req.headers);
    // console.log('<<<< req.params >>>>\n', req.params);
    // console.log('<<<< req.query >>>>\n', req.query);
    // console.log('<<<< req.body >>>>\n', req.body);
    // console.log('<<<< req.files >>>>\n', req.files);
    // console.log('<<<< req.originalUrl >>>>\n', req.originalUrl);
    // console.log('<<<< req.body >>>>\n', req.body);
    next();
}, api);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));