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

app.use('/api', api);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


