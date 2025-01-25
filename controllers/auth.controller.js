import { UserModel } from '../models/user.model.js';
import { generateResponse } from '../utils/helpers.js';
import { compare, hash } from 'bcrypt';

export const register = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next({
            statusCode: 401,
            message: 'Email and password are required',
        });
    }

    const emailExists = await UserModel.findOne({ email });
    if (emailExists) {
        return next({
            statusCode: 409,
            message: 'Email already exists',
        });
    }

    const hashedPassword = await hash(password, 10);

    const user = await UserModel.create({
        email,
        password: hashedPassword
    });
    generateResponse(user, 'Registered successful', res);
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) return next({
        statusCode: 401,
        message: 'Email and password are required',
    });

    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) return next({
        statusCode: 404,
        message: 'user not found',
    });

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) return next({
        statusCode: 401,
        message: 'Invalid credentials',
    });

    generateResponse(user, 'Login successful', res);
}
