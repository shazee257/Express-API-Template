import Joi from "joi";
import { objectId, validateRequest } from "./validate.js";
import { ROLES, STATUS_CODES } from "../utils/constants.js";
import { asyncHandler } from "../utils/helpers.js";
import { getUser } from "../models/index.js";

// user register validator
const userRegisterValidator = Joi.object({
    email: Joi.string().trim().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required(),
    role: Joi.string().valid(...Object.values(ROLES)).required()
});

// Validate email
export const emailExistsValidator = asyncHandler(async (req, res, next) => {
    const user = await getUser({ email: req.body.email });
    if (user) return next({
        statusCode: STATUS_CODES.CONFLICT,
        message: "Email already exists!"
    });
    next();
});

// user login validator
const userLoginValidator = Joi.object({
    email: Joi.string().trim().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required()
});

export const registerValidation = [validateRequest(userRegisterValidator), emailExistsValidator];
export const loginValidation = validateRequest(userLoginValidator);