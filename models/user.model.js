import { Schema, model } from "mongoose";
import { ROLES } from "../utils/constants.js";

const userSchema = new Schema({
    email: { type: String },
    password: { type: String, select: false },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.USER },
}, { timestamps: true });

export const UserModel = model('User', userSchema);
