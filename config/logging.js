const winston = require('winston');
require('winston-mongodb');

module.exports = function () {
    process.on('uncaughtException', (err) => {
        console.log('UNCAUGHT EXCEPTION! 💥');
        winston.error(err.message, err);
    });

    process.on('unhandledRejection', (err) => {
        console.log('UNHANDLED REJECTION! 💥');
        winston.error(err.message, err);
    });

    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    winston.add(new winston.transports.MongoDB({
        db: process.env.MONGODB_URL,
        level: 'info',
    }));
};