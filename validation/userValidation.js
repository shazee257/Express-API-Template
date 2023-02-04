const Joi = require('joi');

const JoiSchema = Joi.object({
    username: Joi.string().min(3).max(30),
    email: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(3).max(30).required(),
    // enum roles
    role: Joi.string().valid('user', 'admin'),

});

module.exports = JoiSchema;