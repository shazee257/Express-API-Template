import { generateResponse, asyncHandler } from '../utils/helpers.js';
import { createUser, getUser } from '../models/index.js';
import { STATUS_CODES } from '../utils/constants.js';

// register user
export const register = asyncHandler(async (req, res, next) => {
    // create user in db
    let user = await createUser(req.body);

    // remove password
    user = user.toObject();
    delete user.password;

    generateResponse(user, "Register successful", res);
});

// login user
export const login = asyncHandler(async (req, res, next) => {
    let user = await getUser({ email: req.body.email }).select('+password');
    if (!user) return next({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: 'Invalid email or password'
    });

    const isPasswordMatch = await user.isPasswordCorrect(req.body.password);
    if (!isPasswordMatch) return next({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: 'Invalid password'
    });

    const accessToken = await user.generateAccessToken();
    req.session = { accessToken };

    // remove password
    user = user.toObject();
    delete user.password;

    generateResponse({ user, accessToken }, 'Login successful', res);
});
