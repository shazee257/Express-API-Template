// for async error handling (no need to use try catch)
require('express-async-errors');
const express = require('express');
const dbConnect = require('./config/dbConnect');
const authApi = require('./api/auth');
const api = require('./api');
require('dotenv').config();
const { isAuth } = require('./middlewares');
const { notFound, errorHandler } = require('./middlewares/errorHandling');

const app = express();
dbConnect();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authApi);

app.use(isAuth);

app.use("/api", api);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


