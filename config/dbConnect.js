const winston = require('winston');
const mongoose = require('mongoose');

const dbConnect = () => {
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log('Connected to DB');
            // winston.info('Connected to DB');
        })
        .catch((error) => {
            console.log("db error: ", error);
            winston.error(error.message, error);
        });
};

module.exports = dbConnect;