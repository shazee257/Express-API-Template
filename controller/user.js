const { generateResponse } = require('../utils');
const {
    createUser,
    findUser,
    updateUserById,
    getUsers,
} = require('../models/user');
const userValidation = require('../validation/userValidation');
const _ = require('lodash');

exports.register = async (req, res, next) => {
    const { username, email, password, role } = req.body;

    // Joi validation
    const { error } = userValidation.validate({ username, role, email, password });
    if (error) {
        return next(new Error(error.details[0].message));
    }

    const userExists = await findUser({ email: req.body.email });
    if (userExists) {
        return next(new Error('User already exists'));
    }

    const user = await createUser(req.body);
    const userObj = _.pick(user, ['_id', 'username', 'email', 'role']);

    if (user) {
        generateResponse(userObj, 'User created successfully', res);
    } else {
        next(new Error('Invalid user data'));
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    // Joi validation
    const { error } = userValidation.validate({ email, password });
    if (error) {
        return next(new Error(error.details[0].message));
    }

    const user = await findUser({ email: email });
    if (user) {
        const isMatch = await user.matchPassword(password);
        if (isMatch) {
            const token = user.generateToken();
            generateResponse(token, 'Login successful', res);
        } else {
            next(new Error('Invalid password'));
        }
    } else {
        next(new Error('Invalid email or password'));
    }
};

exports.getUser = async (req, res, next) => {
    const { _id } = req.user;

    const user = await findUser({ _id: _id });
    const userObj = _.pick(user, ['_id', 'username', 'email', 'role']);
    if (user) {
        generateResponse(userObj, 'User found', res);
    } else {
        next(new Error('User not found'));
    }
}

exports.updateUser = async (req, res, next) => {
    const { _id } = req.user;

    const user = await updateUserById(_id, req.body);
    const userObj = _.pick(user, ['_id', 'username', 'email', 'role']);

    if (user) {
        generateResponse(userObj, 'User updated successfully', res);
    } else {
        next(new Error('User not found'));
    }
}

exports.getAllUsers = async (req, res, next) => {
    const users = await getUsers();
    const userList = _.map(users, _.partialRight(_.pick, ['_id', 'username', 'email', 'role']));
    if (users) {
        generateResponse(userList, 'Users found', res);
    } else {
        next(new Error('Users not found'));
    }
}
