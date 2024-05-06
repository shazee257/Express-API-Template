import Joi from "joi";
import { STATUS_CODES } from "../utils/constants.js";
import { Types } from "mongoose";

export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) return next({
            statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
            message: error.details[0].message.replace(/"/g, ''),
        });
        next();
    };
}

export const validateParams = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.params);
        if (error) return next({
            statusCode: STATUS_CODES.UNPROCESSABLE_ENTITY,
            message: error.details[0].message.replace(/"/g, ''),
        });
        next();
    };
}

// Define a Joi extension for ObjectId validation
export const objectId = Joi.extend((joi) => ({
    type: "objectId",
    base: joi.string(),
    messages: {
        "objectId.base": "{{#label}} must be a valid ObjectId"
    },
    validate(value, helpers) {
        if (!Types.ObjectId.isValid(value)) {
            return { value, errors: helpers.error("objectId.base") };
        }
    }
}));
