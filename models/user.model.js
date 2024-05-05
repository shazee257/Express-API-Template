import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { getMongoosePaginatedData } from "../utils/helpers.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ROLES } from "../utils/constants.js";

// user schema
const userSchema = new Schema({
    email: { type: String, lowercase: true },
    password: { type: String, select: false },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.USER },
}, { timestamps: true });

// hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// compare password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// generate access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: this.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
    );
};

userSchema.plugin(mongoosePaginate);
userSchema.plugin(aggregatePaginate);

const UserModel = model('User', userSchema);

// create new user
export const createUser = (obj) => UserModel.create(obj);

// find user by query
export const getUser = (query) => UserModel.findOne(query);

// get all users
export const getAllUsers = async ({ query, page, limit }) => {
    const { data, pagination } = await getMongoosePaginatedData({
        model: UserModel,
        query,
        page,
        limit
    });

    return { data, pagination };
};
