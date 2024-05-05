import { getUser, getAllUsers } from "../models/index.js";
import { STATUS_CODES } from "../utils/constants.js";
import { asyncHandler, generateResponse } from '../utils/helpers.js';

// get all users
export const fetchAllUsers = asyncHandler(async (req, res, next) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    // also exclude current login user from the list
    const filters = [{ email: { $ne: process.env.ADMIN_EMAIL } }, { _id: { $ne: req.user.id } }];
    if (req.query.role) filters.push({ role: req.query.role });
    const query = { $and: filters };

    const usersData = await getAllUsers({ query, page, limit });
    if (usersData?.data?.length === 0) {
        generateResponse(null, 'No user found', res);
        return;
    }

    generateResponse(usersData, 'List fetched successfully', res);
});

// get current user
export const fetchUser = asyncHandler(async (req, res, next) => {
    const user = await getUser({ _id: req.params.userId }).populate('role lead').lean();
    if (!user) return next({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: 'User not found'
    });

    generateResponse(user, 'User fetched successfully', res);
});